# Do's cluster in IBM Innovation Center 

- VPN: spcaus.spc.ibm.com  (Syd4130:7nnovation!)

- ICP Cluster console https://172.23.50.120:8443 (admin/admin). 
- ICP boot node: ssh root@172.23.50.112 (passw0rd)


# github: https://github.com/gxvigo/meetingActionsMicroservicesK8s


# Login into the environment from my mac

- copy the kubectl setup from ICP Console (https://172.23.50.120:8443)

`
$ cloudctl login -a https://172.23.50.120:8443 --skip-ssl-validation

$ docker login -u admin -p admin mycluster.icp:8500
`
 


# Scenarios walk through

- Show the cluster from console e CLI

$ kubectl cluster-info
$ kubectl get nodes -o wide 
$ kubectl get ns


## create resources following github: https://github.com/gxvigo/meetingActionsMicroservicesK8s

(This assume containers have been already pushed to the private registry)

$ cd /Users/giovanni/opt/workspaces/NodeSamples/meetingActionsMicroservicesK8s
$ kubectl create -f kubernetes-deployments/meetingAppSetup.yaml

$ kubectl get ns
$ kubectl get all -n ms-demo

$ kubectl create -f ./kubernetes-deployments/mongodb.yaml 
$ kubectl get deployments -n ms-demo --watch

$ kubectl get all -n ms-demo
$ kubectl get pods -n ms-demo
$ kubectl get pod NAME_OF_POD -template={{.status.podIP}}




$ kubectl create -f ./kubernetes-deployments/meetingApi.yaml

$ kubectl get all -n ms-demo
$ kubectl get pods -n ms-demo

$ kubectl create -f ./kubernetes-deployments/meetingUi.yaml

$ kubectl get all -n ms-demo
$ kubectl get pods -n ms-demo
$ kubectl get svc -n ms-demo

http://172.23.50.120:30080/  (whatever from kubectl get svc -n ms-demo)


- highlight meetingApi deployment and show how many pods running

$ kubectl get deployment vf-meetingui -n ms-demo
$ kubectl get pods -n ms-demo


- scale up number of replica and show again how many pods running

$ kubectl scale deployments/vf-meetingui --replicas=4 -n ms-demo
$ kubectl get deployment vf-meetingui -n ms-demo
$ kubectl get pods -n ms-demo


- kill one pod and show how many pods are running (focus on pod names)

$ kubectl delete pod vf-meetingui-5b8df77fc4-h5xfr -n ms-demo
$ kubectl get pods  -n ms-demo


- cleanup 

$ cd kubernetes-deployments/
$ kubectl delete -f mongodb.yaml -f meetingUi.yaml -f meetingApi.yaml -f meetingAppSetup.yaml

https://cloud.weave.works/k8s/scope.yaml?k8s-version=$(kubectl version | base64 | tr -d '\n')"



# Troubleshooting


## kubectl create -f ./kubernetes-deployments/mongodb.yaml 
Deny "docker.io/mongo:3.6.5", no matching repositories in ClusterImagePolicy and no ImagePolicies in the "ms-demo" namespace


$ kubectl get clusterimagepolicy
NAME                                    AGE
ibmcloud-default-cluster-image-policy   6d

$ kubernetes-deployments $ kubectl edit clusterimagepolicy/ibmcloud-default-cluster-image-policy
clusterimagepolicy "ibmcloud-default-cluster-image-policy" edited

$ kubernetes-deployments $ kubectl get clusterimagepolicy -o yaml
apiVersion: v1
items:
- apiVersion: securityenforcement.admission.cloud.ibm.com/v1beta1
  kind: ClusterImagePolicy
  metadata:
    creationTimestamp: 2018-10-22T00:33:39Z
    generation: 1
    name: ibmcloud-default-cluster-image-policy
    namespace: ""
    resourceVersion: "1455543"
    selfLink: /apis/securityenforcement.admission.cloud.ibm.com/v1beta1/clusterimagepolicies/ibmcloud-default-cluster-image-policy
    uid: 1eea85a5-d592-11e8-9e12-0050569a796e
  spec:
    repositories:
    - name: mycluster.icp:8500/*
    - name: mycluster.icp:8500/default/*
    - name: registry.bluemix.net/ibm/*
    - name: docker.io/hybridcloudibm/*
    - name: docker.io/ibmcom/*
    - name: docker.io/db2eventstore/*
    - name: docker.io/icpdashdb/*
    - name: docker.io/iighostd/*
    - name: docker.io/store/ibmcorp/*
    - name: docker.io/alpine*
    - name: docker.io/busybox*
    - name: docker.io/dduportal/bats:*
    - name: docker.io/cassandra:*
    - name: docker.io/haproxy:*
    - name: docker.io/hazelcast/hazelcast-kubernetes:*
    - name: docker.io/library/busybox:*
    - name: docker.io/minio/mc:*
    - name: docker.io/minio/minio:*
    - name: docker.io/nginx:*
    - name: docker.io/open-liberty:*
    - name: docker.io/rabbitmq:*
    - name: docker.io/radial/busyboxplus:*
    - name: docker.io/ubuntu*
    - name: docker.io/websphere-liberty:*
    - name: docker.io/wurstmeister/kafka:*
    - name: docker.io/zookeeper:*
    - name: docker.io/ibmcloudcontainers/strongswan:*
    - name: docker.io/opsh2oai/dai-ppc64le:*
    - name: docker.io/redis*
    - name: docker.io/f5networks/k8s-bigip-ctlr:*
    - name: docker.io/rook/rook:*
    - name: docker.io/couchdb:*
    - name: docker.elastic.co/beats/filebeat:*
    - name: docker.io/prom/statsd-exporter:*
    - name: docker.elastic.co/elasticsearch/elasticsearch:*
    - name: docker.elastic.co/kibana/kibana:*
    - name: docker.elastic.co/logstash/logstash:*
    - name: quay.io/k8scsi/csi-attacher:*
    - name: quay.io/k8scsi/driver-registrar:*
    - name: quay.io/k8scsi/nfsplugin:*
    - name: k8s.gcr.io/hyperkube:*
    - name: registry.bluemix.net/armada-master/ibm-worker-recovery:*
    - name: docker.io/maven:*
    - name: docker.io/lachlanevenson/k8s-helm:*
    - name: docker.io/jenkins/*
    - name: docker.io/wwdemo/*
    - name: docker.io/istio/*
    - name: docker.io/*
kind: List
metadata:
  resourceVersion: ""
  selfLink: ""



## $ docker login -u admin -p admin mycluster.icp:8500

WARNING! Using --password via the CLI is insecure. Use --password-stdin.
Error response from daemon: Get https://mycluster.icp:8500/v2/: x509: certificate signed by unknown authority

https://www.ibm.com/support/knowledgecenter/en/SSBS6K_2.1.0/manage_images/configuring_docker_cli.html



## Pod stuck in a Terminating phase

$ kubectl delete pod vf-meetingui-5b8df77fc4-bbmz8  --force --grace-period=0 -n ms-demo




