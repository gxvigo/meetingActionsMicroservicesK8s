# Meeting Actions microservices

This simple application is structure in 3 components:

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

### API / backend

Building Docker image  
From ./meetingAPI  
```
docker build -t vfdemo/meetingapi:0.1.0  .
```

Run image locally on mac (with mongo on localhost:27017):
```
docker run -e MONGO_HOST=docker.for.mac.host.internal -e MONGO_IP=27017 -p 8090:8090 vfdemo/meetingapi:0.1.0
```

Tag the image
```
docker tag vfdemo/meetingapi:0.1.0 mycluster.icp:8500/default/meetingapi:0.1.0
```

Push image on ICP private image repository:
```
docker push...
```



### Database - MongoDD

Single replica for simplicity  
Service name (dns) ClusterIP: vf-demo  
A NodePort service for testing purpose has been created, access mongo from a client to the proxy-node IP of your cluster to the port 30017
