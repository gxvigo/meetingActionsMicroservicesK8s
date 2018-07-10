# Meeting Actions microservices

In this section we will cover jobs controller.
In kubernetes a 'job' is a container with a finite life, it runs and complete the tasks it has being built for. 
Kubernetes scheduler dosn't restart the container once completed (if exit 0).

In this example, the job will create a database (meetingactions) a collection (todo) and insert a couple of record in it.



### Meeting Mongo Init

Firstly we have to create an image
  
From ./meetingMongoInit  

Building Docker image
```
docker build -t meeting-mongo-init:0.1.0  .
```

Run image locally on mac (with mongo active on localhost:27017):
```
docker run -e MONGO_HOST='docker.for.mac.host.internal' meeting-mongo-init:0.1.0
```

Tag the image for uploading into ICP
```
docker tag meeting-mongo-init:0.1.0 mycluster.icp:8500/ms-demo/meeting-mongo-init:0.1.0
```   

Login into remote repository
```
docker login -u admin -p admin mycluster.icp:8500
```  

Push image on ICP private image repository:
```
 docker push mycluster.icp:8500/ms-demo/meeting-mongo-init:0.1.0
```  

** If the same image is pushed twice, the worker node won't replace the local existing image with the one from the repository**


For convenience the commands above have been placed in the script ./meetingui/buildAndPush.sh  




### Deploy the job

(from kubernetes-deployments directory)

Be sure that Mongo has been deployed:

```
kubectl create -f ./kubernetes-deployments/mongodb.yaml
```

and other components (like configMap with Mongo env vars) are created

```
kubectl create -f kubernetes-deployments/meetingAppSetup.yaml
```

Then run the job:

```
kubectl create -f mongo-init-job.yaml
```
