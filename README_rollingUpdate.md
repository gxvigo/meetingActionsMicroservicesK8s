# Meeting Actions microservices

In this section we will cover rolling update.

This can be achieved in different ways, we will start covering a 'runtime' option, where we update the deployment definition with kubectl command. 



### UI / frontend - v0.2.0

Firstly we have to create a new image, to do so make a change to the ui application.
For simplicity we can change the main page title, open the file ./meetingUI/views/pages/myindex.ejs and change line 37

FROM "Meeting actions! " TO "Meeting actions! v020"

The rebuild the image with a new tag version

  
From ./meetingUi  

Building Docker image
```
docker build -t meetingui:0.2.0  .
```

Run image locally on mac (with meetingApi on localhost:8090):
```
docker run -e MEETING_API_HOST=docker.for.mac.host.internal -e MEETING_API_PORT=8090 -p 8080:8080 meetingui:0.2.0
```

Tag the image for uploading into ICP
```
docker tag meetingui:0.2.0 mycluster.icp:8500/ms-demo/meetingui:0.2.0
```   

Login into remote repository
```
docker login -u admin -p admin mycluster.icp:8500
```  

Push image on ICP private image repository:
```
 docker push mycluster.icp:8500/ms-demo/meetingui:0.2.0
```  

** If the same image is pushed twice, the worker node won't replace the local existing image with the one from the repository**


For convenience the commands above have been placed in the script ./meetingui/buildAndPush.sh  


### RollingUpdate Frontend


First let's scale up our deployment, this ways it's a bit easier to see what happens

```
kubectl scale deployments/vf-meetingui --replicas=4 -n ms-demo
```  


To update the image of the application to version 0.2, use the set image command, followed by the deployment name and the new image version. This will not only set the new image, but it triggers the updates of the pods.

```
kubectl set image deployments/vf-meetingui vf-meetingui=mycluster.icp:8500/ms-demo/meetingui:0.2.0 -n ms-demo
```

To observe the behavior (pod replacement) run:

```
watch kubectl get pods -n ms-demo
```  

To check the status of the rollout  

```
kubectl rollout status deployments/vf-meetingui -n ms-demo
```

Check application:  [meeting actions UI](http://meetingactions/)


### Rollback to v0.1.0

It's possible roll back to our previously working version. 

```
kubectl rollout undo deployments/vf-meetingui -n ms-demo
```

The rollout command reverted the deployment to the previous known state (v0.1.0 of the image). 
Updates are versioned and you can revert to any previously know state of a Deployment

To check the status of the rollout  

```
kubectl rollout status deployments/vf-meetingui -n ms-demo
```

Check application:  [meeting actions UI](http://meetingactions/)