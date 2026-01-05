# Eesti-NaijaFood Frontend - Next.js

Modern, responsive frontend for Eesti-NaijaFood African restaurant built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🎨 **Modern Design** - Sleek, vibrant design with African-inspired color schemes
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- ⚡ **Fast Performance** - Server-side rendering and optimized images
- 🎭 **Smooth Animations** - Framer Motion for engaging transitions
- 📅 **Online Booking** - Real-time table reservation system
- 🍽️ **Dynamic Menu** - Interactive menu with categories and filters
- 🎵 **African Experience** - Dedicated section for music events
- 📧 **Contact Forms** - Easy communication with validation
- 🎉 **Catering Quotes** - Request catering services online
- 📰 **Newsletter** - Subscription management

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Forms:** React Hook Form
- **HTTP Client:** Axios
- **Notifications:** React Toastify
- **Icons:** React Icons

## Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Backend API running on port 5001

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
Eesti-NaijaFood-frontend/
├── app/
│   ├── page.tsx                    # Home page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   ├── menu/
│   │   └── page.tsx               # Menu page
│   ├── bookings/
│   │   └── page.tsx               # Booking page
│   ├── african-experience/
│   │   └── page.tsx               # African Experience page
│   ├── catering/
│   │   └── page.tsx               # Catering page
│   ├── about/
│   │   └── page.tsx               # About page
│   └── contact/
│       └── page.tsx               # Contact page
├── components/
│   ├── Navbar.tsx                 # Navigation bar
│   ├── Footer.tsx                 # Footer component
│   └── ...                        # Other reusable components
├── lib/
│   └── api.ts                     # API utility functions
├── public/
│   └── images/                    # Static images
├── tailwind.config.ts             # Tailwind configuration
├── next.config.js                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json
```

## Pages Overview

### Home Page (`/`)
- Hero section with call-to-actions
- Quick links to key features
- About section
- African Experience highlight
- Dish of the week showcase
- CTA sections

### Menu Page (`/menu`)
- Category-based navigation
- Menu items with images and prices
- Dietary indicators (vegetarian, spicy)
- Download PDF option
- Dish of the week feature
- Order online buttons (DoorDash, Uber Eats)

### Bookings Page (`/bookings`)
- Booking form with validation
- Date and time selection
- Guest count and booking type
- Special requests field
- Instant confirmation
- Success screen with booking reference

### African Experience Page (`/african-experience`)
- Event showcase
- Weekly schedule
- What to expect section
- Upcoming events calendar
- Photo gallery
- Booking integration

### Catering Page (`/catering`)
- Catering packages
- Quote request form
- File upload for attachments
- Event type selection
- Instant quote reference

### Contact Page (`/contact`)
- Contact form
- Location map
- Opening hours
- Social media links
- Phone and email

### About Page (`/about`)
- Restaurant story
- Team information
- Mission and values
- African culture focus

## Components

### Navbar
- Responsive design
- Mobile menu
- Smooth scroll
- Sticky on scroll
- Book Now CTA

### Footer
- Quick links
- Contact information
- Opening hours
- Social media icons
- Newsletter subscription
- Legal links

## API Integration

All API calls are centralized in `lib/api.ts`:

```typescript
import { bookingAPI, menuAPI, eventsAPI } from '@/lib/api';

// Create booking
const response = await bookingAPI.create(bookingData);

// Get menu
const menu = await menuAPI.getAll();

// Get events
const events = await eventsAPI.getUpcoming();
```

## Form Validation

Using React Hook Form:

```typescript
const { register, handleSubmit, formState: { errors } } = useForm();

<input
  {...register('email', {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email'
    }
  })}
/>
```

## Animations

Using Framer Motion:

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

## Styling

Tailwind CSS utility classes:

```typescript
<div className="bg-gray-900 rounded-2xl p-8 hover:scale-105 transition-all">
  Content
</div>
```

## Image Optimization

Next.js Image component:

```typescript
<Image
  src="/images/dish.jpg"
  alt="Dish name"
  width={500}
  height={300}
  className="object-cover"
/>
```

## Build & Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
# Or use Vercel CLI
vercel --prod
```

## Environment Variables

### Development
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production
```env
NEXT_PUBLIC_API_URL=https://api.Eesti-NaijaFood.co.nz
NEXT_PUBLIC_SITE_URL=https://Eesti-NaijaFood.co.nz
```

## Performance Optimization

- Server-side rendering (SSR)
- Image optimization with Next.js Image
- Code splitting
- Lazy loading components
- CSS optimization with Tailwind
- Font optimization

## SEO Optimization

- Meta tags in layout.tsx
- Dynamic meta tags per page
- Structured data
- Sitemap
- robots.txt
- Open Graph tags

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast compliance
- Focus indicators

## Testing

```bash
# Run linter
npm run lint

# Type checking
npx tsc --noEmit
```

## Common Issues

### API Connection Error
- Ensure backend is running on port 5001
- Check CORS settings in backend
- Verify NEXT_PUBLIC_API_URL in .env.local

### Images Not Loading
- Check image paths in public folder
- Verify next.config.js image domains
- Use Next.js Image component

### Build Errors
- Clear .next folder: `rm -rf .next`
- Delete node_modules and reinstall
- Check for TypeScript errors

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Support

For issues or questions:
- Email: oladoyinemmanuel@gmail.com
- Documentation: [Docs](https://docs.Eesti-NaijaFood.co.nz)

## License

MIT License

---

**Built with ❤️ for Eesti-NaijaFood - Taste Africa in Auckland**# Emnac Tech
