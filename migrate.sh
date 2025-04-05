#!/bin/bash
env $(cat .env.development.local | xargs) yarn run node-pg-migrate up