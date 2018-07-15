Namespace: elasticsearch-release
Helm release: elasticsearch-release




cat <<EOF | kubectl create -f -
---

apiVersion: v1
kind: PersistentVolume
metadata:
  name: m-0
spec:
  capacity:
    storage: 4Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Recycle
  claimRef:
    namespace: elasticsearch-release
    name: data-elasticsearch-release-master-0	
  nfs:
    # FIXME: use the right IP
    server: 192.168.225.60
    path: "/nfsvol/elasticsearch/m-0"

---

apiVersion: v1
kind: PersistentVolume
metadata:
  name: m-1
spec:
  capacity:
    storage: 4Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Recycle
  claimRef:
    namespace: elasticsearch-release
    name: data-elasticsearch-release-master-1	
  nfs:
    # FIXME: use the right IP
    server: 192.168.225.60
    path: "/nfsvol/elasticsearch/m-1"
	
---

apiVersion: v1
kind: PersistentVolume
metadata:
  name: m-2
spec:
  capacity:
    storage: 4Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Recycle
  claimRef:
    namespace: elasticsearch-release
    name: data-elasticsearch-release-master-2	
  nfs:
    # FIXME: use the right IP
    server: 192.168.225.60
    path: "/nfsvol/elasticsearch/m-2"	

---

apiVersion: v1
kind: PersistentVolume
metadata:
  name: d-0
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Recycle
  claimRef:
    namespace: elasticsearch-release
    name: data-elasticsearch-release-data-0	
  nfs:
    # FIXME: use the right IP
    server: 192.168.225.60
    path: "/nfsvol/elasticsearch/d-0"	

---

apiVersion: v1
kind: PersistentVolume
metadata:
  name: d-1
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Recycle
  claimRef:
    namespace: elasticsearch-release
    name: data-elasticsearch-release-data-1	
  nfs:
    # FIXME: use the right IP
    server: 192.168.225.60
    path: "/nfsvol/elasticsearch/d-1"		
	
EOF	




cat <<EOF | kubectl create -f -
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: elastic-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: privileged
subjects:
- kind: ServiceAccount
  name: default
  namespace: elasticsearch-release
  
EOF 