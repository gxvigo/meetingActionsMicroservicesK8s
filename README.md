# Meeting Actions microservices

This simple application is structured in 3 components:

- UI (Node.js, Express, Angular)
- API (Node.js, Express, Mongoose)
- Mongo 


### UI - meetingFrontend
 
application directrory: ./meetingFrontend  
default listening port: **8080**

### API / backend - meetingApi

application directrory: ./meetingApi  
default listening port: **8090**


### Database - Mongodb

application directrory: N/A
default listening port: **127027**





## Deployment


Kubernetes deployment yaml files are stored ./kubernetes-deployment
Everything running in ms-demo namespace  

All the command must be run from a system with kubectl installed and configured to talk to the master node.
In my test environments this can be my nfs server or the boot node.

*I found an issue, not solved yet, to perform Docker login to my private registry in ICP from mac*  

### Initial setup

This microservice application will live in a custom namespace: ms-demo
This is great for resource isolation but it requires a bit of extrawork.
First we have to create a namespace.
Then, because we will upload Docker images in the private registry in the custom namespace, it's necessary to create a secret with the credentials and use the secret in the deployments where the images are used.
All the resources are created executing yaml files, but because the secret is obfuscate, it's not really clear what it does, for clarity the kubectl command to create the same secret is listed below:

```
kubectl create secret docker-registry ms-demo-secret --docker-server=mycluster.icp:8500 --docker-username=admin --docker-password=admin --docker-email=admin@admin.com --namespace ms-demo
```  

To reset the environment, beyod deleting all kubernetes resources  
```
kubectl delete -f <all yaml files>
```  

It's necessary to delete the application images (meeting*). This must be done in
- private registry in ICP (console)
- worker nodes. this is not necessay if you deploy a new image (different tag) or if in the deployment the policy **imagePullPolicy : Always**



### Database - MongoDD

Single replica for simplicity  
Service name (dns) ClusterIP: vf-demo 

This is the simplest deployment. There's no custom code or local image to build. All the definitions to create the data storage for our applications are in ./kubernetes-deployments/mongodb.yaml  

Deploy:

```
kubectl create -f ./kubernetes-deployments/mongodb.yaml
```

What's created:

- service - ClusterIP for service discovery (other pods can connect to mongo via dns - service-name:27017)
- persistent volume claim - to store mongodb data. Data can be lost in case of restart or update of the service. Persistent storage (always connect to the same volume) is not relevant for this scenario
- deployment - simple defintion of pod and volume

*A NodePort service for testing purpose has been created, access mongo from a client to the proxy-node IP of your cluster to the port 30017 -- this is not necessary for application functionality and can be removed*



### API / backend

** If the same image is pushed twice, the worker node won't replace the local existing image with the one from the repository**

Building Docker image  
From ./meetingApi  
```
docker build -t meetingapi:0.1.0  .
```

Run image locally on mac (with mongo on localhost:27017):
```
docker run -e MONGO_HOST=docker.for.mac.host.internal -e MONGO_PORT=27017 -p 8090:8090 meetingapi:0.1.0
```

Tag the image for uploading into ICP
```
docker tag meetingapi:0.1.0 mycluster.icp:8500/ms-demo/meetingapi:0.1.0
```   

Login into remote repository
```
docker login -u admin -p admin mycluster.icp:8500
```  

Push image on ICP private image repository:
```
 docker push mycluster.icp:8500/ms-demo/meetingapi:0.1.0
```  

For convenience the commands above have been placed in the script ./meetingApi/buildAndPush.sh  


Deploy:

```
kubectl create -f ./kubernetes-deployments/meetingApi.yaml
```

What's created:

- service - ClusterIP for service discovery (other pods can connect to mongo via dns - service-name:27017)
- config map - to decouple configuration from code (mongodb access details)
- deployment - defintion of a pod 


### UI / frontend

** If the same image is pushed twice, the worker node won't replace the local existing image with the one from the repository**

Building Docker image  
From ./meetingUi  
```
docker build -t meetingui:0.1.0  .
```

Run image locally on mac (with mongo on localhost:8090):
```
docker run -e MEETING_API_HOST=docker.for.mac.host.internal -e MEETING_API_PORT=8090 -p 8080:8080 meetingui:0.1.0
```

Tag the image for uploading into ICP
```
docker tag meetingui:0.1.0 mycluster.icp:8500/ms-demo/meetingui:0.1.0
```   

Login into remote repository
```
docker login -u admin -p admin mycluster.icp:8500
```  

Push image on ICP private image repository:
```
 docker push mycluster.icp:8500/ms-demo/meetingui:0.1.0
```  

For convenience the commands above have been placed in the script ./meetingui/buildAndPush.sh  


Deploy:

```
kubectl create -f ./kubernetes-deployments/meetingUi.yaml
```

What's created:

- service - ClusterIP for service discovery (other pods can connect to mongo via dns - service-name:27017)
- config map - to decouple configuration from code (mongodb access details)
- deployment - defintion of a pod 