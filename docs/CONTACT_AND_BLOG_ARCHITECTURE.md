# EduManage - Contact System & Blog Search Architecture

This document provides technical documentation on the Contact Messages System and Blog Search feature implemented for the EduManage platform.

---

## 1. Contact Messages & Inquiries System

### Architecture Overview
The Contact Messages feature enables prospective schools, students, teachers, and guardians to submit inquiries directly from the public Contact page (`/contact`). Inquiries are securely stored in the database and accessible **exclusively to administrators** within the Admin Dashboard (`/admin/contactMessages`).

```
[Public Contact Page]
       | (POST /api/contact)
       v
[Next.js API Route / Express Server]
       |
       v
[MongoDB ContactMessage Collection]
       |
       v (GET /api/contact?userRole=admin)
[Admin Dashboard: /admin/contactMessages]
```

### Security & Role Authorization
- **Public Submission**: Any visitor can submit a contact inquiry without authentication.
- **Admin Isolation**: Retrieving, updating, or deleting messages requires verification of the `admin` role via session and `x-user-role` header check.
- **Client Route Guarding**: Non-admin users attempting to navigate to `/admin/contactMessages` are presented with an `Access Restricted` shield.

### Data Model (`ContactMessage`)
| Field | Type | Description |
|---|---|---|
| `name` | String (Required) | Full name of the sender |
| `email` | String (Required) | Contact email address |
| `phone` | String (Optional) | Contact telephone/mobile number |
| `role` | String | Submitter role (School Admin, Teacher, Parent, Student, etc.) |
| `subject` | String (Required) | Inquiry subject |
| `message` | String (Required) | Full message body |
| `status` | Enum | `'unread'`, `'read'`, `'replied'`, `'archived'` |
| `adminNotes`| String (Optional) | Internal notes by school administrators |
| `createdAt` | Date | Timestamp of submission |

### Admin Dashboard Features
- **Real-Time Counters**: Shows Total Inquiries, Unread, and Replied counts.
- **Filter & Search**: Instant filter by status (`unread`, `read`, `replied`), role, and search term.
- **Detail Modal**: Opens full inquiry with sender information and timestamps.
- **Quick Reply (`mailto:`)**: One-click compose email to the submitter.
- **CSV Export**: Export all filtered inquiries for reporting and offline record-keeping.

---

## 2. Blog Search Feature

### Architecture & Matching Rules
The blog search is designed with strict relevance criteria:
- Searches match strictly against the article **`title`** and **`tags`**.
- Searches are case-insensitive and handle multi-word queries.
- Instant debounce (300ms) provides responsive live searching while preventing redundant server queries.
- If no matching articles are found, a clear "No articles found" empty-state UI is presented along with a quick-reset button.

### Backend Search Optimization
```javascript
const searchRegex = new RegExp(escapeRegex(search.trim()), 'i');
filter.$or = [
  { title: { $regex: searchRegex } },
  { tags: { $in: [searchRegex] } }
];
```

---

## 3. API Reference

### Contact Endpoints
- `POST /api/contact` - Submit a new inquiry (Public)
- `GET /api/contact` - Retrieve inquiries (Admin only)
- `PATCH /api/contact/[id]` - Update inquiry status or admin notes (Admin only)
- `DELETE /api/contact/[id]` - Remove an inquiry (Admin only)

### Blog Endpoints
- `GET /api/blogs` - Fetch blog posts with optional `search` and `category` query parameters.
