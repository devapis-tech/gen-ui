# Frontend-Backend Proxy Setup

## Architecture
- **Frontend**: Next.js app running in Docker on port 6598 (publicly accessible)
- **Backend**: Local application running on port 5000 (internal only)
- **Proxy**: Frontend communicates with backend through `/api/proxy` endpoint

## How It Works

### Frontend (Docker Container)
- Accessible at: `https://grafana.pn.multipliersolutions.in/`
- Running in Docker with port mapping `6598:3000`
- Communicates with backend via Docker bridge network

### Backend (Local Application)
- Should run on `http://172.17.0.1:5000` (Docker bridge gateway)
- Or accessible from Docker container at this IP
- Not exposed publicly - only accessible from frontend
- Can be any HTTP server (Node.js, Python, etc.)

### API Communication
Frontend makes requests to backend via proxy:

```javascript
// Using the API utility
import { api } from '@/lib/api';

// GET request to backend
const data = await api.get('/users');

// POST request to backend
const result = await api.post('/users', { name: 'John' });
```

Or directly:

```javascript
// Direct proxy calls
const response = await fetch('/api/proxy?url=/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ data: 'example' })
});
```

## Environment Variables
- `NEXT_PUBLIC_BACKEND_URL`: Backend URL (default: `http://localhost:5000`)
- `PORT`: Frontend port (set to 6598)

## Deployment Commands

### Start Frontend
```bash
docker-compose up --build -d
```

### Check Status
```bash
docker-compose ps
docker logs new-gen-ui_app_1
```

### Stop Frontend
```bash
docker-compose down
```

## Backend Setup
Your backend should:
1. Run on `http://localhost:5000`
2. Handle CORS (if needed)
3. Provide REST API endpoints

Example backend endpoints:
- `GET /api/users` - Get users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Security Benefits
- Backend not exposed to internet
- Only frontend accessible publicly
- All backend requests go through controlled proxy
- Can add authentication/authorization in proxy layer

## Testing
1. Start your backend on port 5000
2. Access frontend at `https://grafana.pn.multipliersolutions.in/`
3. Check browser network tab for proxy requests
4. Monitor container logs: `docker logs new-gen-ui_app_1 -f`
