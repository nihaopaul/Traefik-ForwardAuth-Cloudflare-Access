The following is a ForwardAuth service for Traefik 2.x working with Cloudflare Access, caching the certifcates from Cloudflare, validating JWT headers and also validating the Audience ID (AUD), its serves as a PoC 

```servicename.toml

[http.routers]
  [http.routers.servicename]
    ...
    rule = "Host(`some.domain.name`) && PathPrefix(`/servicename`)" <-- this needs to match your setup in cloudflare Access
    ...
    middlewares = ["auth"]

  [http.routers.servicename.tls]
    ...

  [http.middlewares.auth.forwardAuth]
    address = "http://[nodejs.server.address]:[port]/auth"


[http.services]
  [[http.services.servicename.loadBalancer.servers]]
    ...


```