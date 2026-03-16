{
  "version": 2,
  "rewrites": [
    { "source": "/api/trpc/(.*)", "destination": "/api/index" },
    { "source": "/api/(.*)", "destination": "/api/index" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
