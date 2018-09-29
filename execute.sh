#!/bin/bash
mongod &
cd path/to/the/root/project
npm run start &
npm run dev &
