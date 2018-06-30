# Meeting Actions microservices - Probe

In this section we will cover Kubernetes health check

In Kubernetes there are 2 kind of probes: Readiness and Liveness.
- Readiness : used to let Kubernetes know when the app is ready to serve traffic, then Kubernetes will start sending traffic to the pod
- Liveness : used to check if the application is alive or dead.

Probe can be implemented in 3 ways:
- HTTP
- Command
- TCP
  
MeetingApi has been geard to understand and test Kubernetes liveness Probe. An HTTP endpoint has been instrumented for the test:

```
GET /api/healthCheck
```
By default it returns 200 and an "ok" message. But it's behaviour can be changed using other 2 endpoints:

```
GET /api/breakIt 
```
this force the healthCheck endpoint to return a 500 status, thus Kubernetes will restart the POD
  
```
GET /api/fixIt 
```
this endpoint fix the situation (this isn't really necessary because when the POD restarts %/api/healthCheck% starts working again)

