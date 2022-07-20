## How to create an image and run the image with kubernetes

> Go to the folder

> Run the Dockerfile and tag with the name same as infrastructure/ files (example : `docker build -t parthahuja143/posts-deploy:1.0.0 .` )

> Run the Deployment/Service/Pod (`kubectl -f apply deployment.yaml`)

## Updating the image used by a Deployment

### Method 1 (Not preferred)

> Run `kubectl apply -f deployment.yaml` will output deployment configured and not created

### Method 2 (Preferred)

> Use latest image tags

> Don't tag images with the version numbers

> Build the images

> Push the image

> kubectl rollout restart deployment {deployment_name}

## Types of Services

1. Cluster IP - Let's Pods communicate inside the Cluster

2. NodePort - Let's Pods communicate with the outside world. Used mainly for development environment.

3. Load Balancer - Let's Pods communicate outside the cluster, requires more configs and works like NodePort.

4. External Name - Redirects an in-cluster request to an external CNAME url.#   m i c r o s e r v i c e s - i n t r o  
 