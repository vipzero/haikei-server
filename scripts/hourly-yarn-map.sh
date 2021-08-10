#!/bin/sh

# 1 hour
SLEEP_SEC=3600
LOOP_MAX=10000

COUNT=0
while [ $COUNT -lt $LOOP_MAX ]
do
  echo $COUNT
  yarn map

  sleep ${SLEEP_SEC}
  COUNT=`expr ${COUNT} + 1`
done
