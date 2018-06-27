# Meeting Actions microservices

In this section we will cover rolling update.

This can be achieved in different ways, we will start covering a 'runtime' option, where we update the deployment definition with kubectl command. 



### UI / frontend - v0.2.0

Firstly we have to create a new image, to do so make a change to the ui application.
For simplicity we can change the main page title, open the file ./meetingUI/views/pages/myindex.ejs and change line 37

FROM "Meeting actions! " TO "New meeting actions!"

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


To update the image of the application to version 2, use the set image command, followed by the deployment name and the new image version. This will not only set the new image, but it triggers the updates of the pods.

```
kubectl set image deployments/vf-meetingui vf-meetingui=ms-demo/meetingui:0.2.0 -n ms-demo
```