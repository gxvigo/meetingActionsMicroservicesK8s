### Network security

By default any pods can communicate with any pods, no matter in what namespace they are running.
Using NetworkPolicy is possible to isolate traffic between pods.

# Specifi pods isolation

In this example it's shown how to isolate specific pods in a given namespace and prevent access from other pods.


- First create a test namespace:

```
kubectl create ns isolated-pods
```

- Run a pod (create a deployment)

```
kubectl run --namespace=isolated-pods nginx --replicas=2 --image=nginx
```

- create a Service to expose the pod(s).

```
kubectl expose --namespace=isolated-pods deployment nginx --port=80
```

- run a pod (same namespace) to test connectivity to pods in isolated-pods namespace, 
  and from the pod's shell establis a connection

```
kubectl run access --namespace=isolated-pods --rm -ti --image busybox /bin/sh

wget -q nginx -O -
```
It returns default nginx page

Only pods in the same namespace can call services with base name, otherwise it's necessary
to use fully qualified hostname

```
kubectl run access --namespace=default --rm -ti --image busybox /bin/sh

wget -q nginx.isolated-pods.svc.cluster.local -O -
```
It return default nginx page


- Let's create a NetworkPolicy that deny access to pods with name 'nginx'

```
cat << EOF | kubectl create -f -
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  namespace: isolated-pods
  name: access-nginx
spec:
  podSelector:
    matchLabels:
      run: nginx
  ingress:
  - from:
    - podSelector:
        matchLabels:
          access: "true"
EOF
```

Repeating the same test above, it will fail:

```
kubectl run access --namespace=isolated-pods --rm -ti --image busybox /bin/sh

wget -q nginx --timeout=5 -O -
```
The command fails: *wget: download timed out*

In order to acces the pod, the calling pod must have a label &access& set to &true&

```
kubectl run access --namespace=isolated-pods --labels="access=true" --rm -ti --image busybox /bin/sh

wget -q nginx --timeout=5 -O -
```
It returns default nginx page



# All pods isolation

In this example it's shown how to isolate all pods in a given namespace and prevent access from other pods.

- Cleanup previous scenario

```
kubectl delete ns isolated-pods
```


- Create a test namespace:

```
kubectl create ns isolated-pods
```

- Run a pod (create a deployment)

```
kubectl run --namespace=isolated-pods nginx --replicas=2 --image=nginx
```

- create a Service to expose the pod(s).

```
kubectl expose --namespace=isolated-pods deployment nginx --port=80
```

- run a pod (same namespace) to test connectivity to pods in isolated-pods namespace, 
  and from the pod's shell establis a connection

```
kubectl run access --namespace=isolated-pods --rm -ti --image busybox /bin/sh

wget -q nginx --timeout=5 -O -
```
It returns default nginx page


- Let's create a NetworkPolicy that denies access to amy pods 

```
cat << EOF | kubectl create -f -
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  namespace: isolated-pods
  name: default-deny
spec:
  podSelector: {}
  policyTypes:
  - Ingress
EOF
```

Repeating the same test above, it will fail:

```
kubectl run access --namespace=isolated-pods --rm -ti --image busybox /bin/sh

wget -q nginx --timeout=5 -O -
```
The command fails: *wget: download timed out*




TO BE COMPLETED: 
https://docs.projectcalico.org/v3.0/getting-started/kubernetes/tutorials/advanced-policy
