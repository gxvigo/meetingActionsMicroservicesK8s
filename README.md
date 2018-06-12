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


Kubernetes deployment yaml file in ./kubernetes-deployment

Everything running in ms-demo namespace  

### Initial setup

This microservice application will live in a custom namespace: ms-demo
This is great for resource isolation but it requires a bit of extrawork.
First we hav to create a namespace.
Then, because we will upload Docker images in the private registry in the custom namespace, it's necessary to create a secret with the credentials and use the secret in the deployments where the images are used.
All the resources are created executing yaml files, but because the secret is obfuscate, it's not really clear what it does, for clarity the kubectl command to create the same secret is listed below:

```
kubectl create secret docker-registry ms-demo-secret --docker-server=mycluster.icp:8500 --docker-username=admin --docker-password=admin --docker-email=admin@admin.com --namespace ms-demo
```


### Database - MongoDD

Single replica for simplicity  
Service name (dns) ClusterIP: vf-demo  
A NodePort service for testing purpose has been created, access mongo from a client to the proxy-node IP of your cluster to the port 30017

### API / backend

** If the same image is pushed twice, the worker node won't replace the local existing image with the one from the repository**

Building Docker image  
From ./meetingAPI  
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



### Database - MongoDD

Single replica for simplicity  
Service name (dns) ClusterIP: vf-demo  
A NodePort service for testing purpose has been created, access mongo from a client to the proxy-node IP of your cluster to the port 30017
