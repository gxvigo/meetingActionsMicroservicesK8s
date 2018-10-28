# Explore default logging on ICP


## create some log data

- Create a namespace:

```
kubectl create ns giovanni
```

- Star an interactive session with a new busybox container in the created namespace

```
kubectl -n giovanni run -i --tty busybox --image=busybox -- sh 
```

- Or start an interactive session with an existing busybox container

```
kubectl -n giovanni get pods

NAME                                        READY     STATUS    RESTARTS   AGE
busybox-5858cc4697-mn2hd                    1/1       Running   0          9h
node-sample-ibm-nodejs-s-5dbf558b8d-s26tf   1/1       Running   0          9h

kubectl -n giovanni exec -it busybox-5858cc4697-mn2hd -- sh
```


In the container shell, send some message to stderr:

```
# echo This message goes to stderr >&2
# echo $'{\'city\':\'milano\'}'  >&2
```

## exploring Kibana

- from ICP console go to Platform - Logging. Kibana page should appear
- 
