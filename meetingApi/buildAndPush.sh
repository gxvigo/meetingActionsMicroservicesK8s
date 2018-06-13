#!/bin/bash

docker build -t meetingapi:0.1.1  .
docker tag meetingapi:0.1.1 mycluster.icp:8500/ms-demo/meetingapi:0.1.1
docker login -u admin -p admin mycluster.icp:8500
docker push mycluster.icp:8500/ms-demo/meetingapi:0.1.1
