# Restaurant Kiosk Application

A modern, full-featured restaurant kiosk ordering system built with Next.js 15, TypeScript, and Tailwind CSS. Designed for self-service kiosks with multi-language support, intuitive UI, and comprehensive features.

## 🚀 Features

### Core Functionality

- **Multi-Language Support**: 6 languages (English, French, Dutch, German, Spanish, Italian)
- **Food & Drinks Menu**: Categorized browsing with filtering
- **Smart Filtering**: Category and price range filters
- **Shopping Cart**: Real-time cart management with item customization
- **Order Review**: Comprehensive order summary before payment
- **Multiple Payment Methods**: Credit/Debit Card, Mobile Payment, Cash
- **Responsive Design**: Works on all screen sizes (optimized for kiosk displays)

### Kiosk-Specific Features

- **Idle Timer**: Auto-reset after 90 seconds of inactivity with 30-second warning
- **Error Boundary**: Graceful error handling with recovery options
- **Confirmation Dialogs**: Prevent accidental actions
- **Loading States**: Skeleton screens for better perceived performance
- **Touch-Optimized**: Large buttons and touch-friendly interface
- **Accessibility**: ARIA labels and semantic HTML

## 📁 Project Structure

```
kiosk-version-/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main application page
│   └── globals.css         # Global styles and Tailwind config
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # Top navigation with language selector
│   │   └── Sidebar.tsx     # Side navigation for steps
│   ├── sections/
│   │   ├── FoodSection.tsx     # Food menu browsing
│   │   ├── DrinksSection.tsx   # Drinks menu browsing
│   │   ├── ReviewSection.tsx   # Order review
│   │   └── PaymentSection.tsx  # Payment processing
│   └── ui/
│       ├── MenuItem.tsx            # Menu item card
│       ├── FilterBar.tsx           # Category and price filters
│       ├── CartSidebar.tsx         # Shopping cart sidebar
│       ├── ItemOptionsModal.tsx    # Item customization modal
│       ├── BackToTop.tsx           # Scroll to top button
│       ├── IdleTimer.tsx           # Inactivity timer
│       ├── ErrorBoundary.tsx       # Error handling
│       ├── ConfirmDialog.tsx       # Confirmation dialogs
│       └── LoadingSkeleton.tsx     # Loading states
├── context/
│   └── KioskContext.tsx    # Global state management
├── hooks/
│   ├── useTranslation.ts   # Translation hook
│   └── useFilters.ts       # Filtering logic hook
├── lib/
│   └── utils.ts            # Utility functions
├── types/
│   └── index.ts            # TypeScript type definitions
├── data/
│   └── restaurant-data.ts  # Menu items and translations
└── public/
    └── assets/             # Static assets (logos, images)
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.4 (App Router)
- **Language**: TypeScript 5.7.2
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide React
- **State Management**: React Context API
- **Image Optimization**: Next.js Image component

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd kiosk-version-
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🔧 Configuration

### Idle Timer Settings

Edit `app/layout.tsx` to adjust idle timer:

```tsx
<IdleTimer
  idleTimeout={90000} // 90 seconds before warning
  warningTimeout={30000} // 30 seconds warning countdown
/>
```

### Tax Rate

Edit `data/restaurant-data.ts`:

```typescript
export const TAX_RATE = 0.085; // 8.5% tax
```

### Languages

Add or modify languages in `data/restaurant-data.ts`:

```typescript
translations: {
  en: { /* English translations */ },
  fr: { /* French translations */ },
  // Add more languages...
}
```

### Menu Items

Add or modify menu items in `data/restaurant-data.ts`:

```typescript
foodItems: [
  {
    id: 1,
    name: "Item Name",
    description: "Item description",
    price: 12.99,
    category: "category-name",
    image: "/path/to/image.jpg",
    hasOptions: true,
    options: [
      /* customization options */
    ],
  },
];
```

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    50: '#f5f7ff',
    500: '#667eea',
    600: '#5a67d8',
  },
  secondary: {
    500: '#764ba2',
  }
}
```

### Global Styles

Edit `app/globals.css` for custom animations, button styles, and more.

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy to Vercel

```bash
vercel deploy
```

## 📱 Kiosk Best Practices Implemented

1. **Auto-Reset on Inactivity**

   - Prevents customer data from being visible to next user
   - Configurable timeout periods
   - Warning before reset

2. **Large Touch Targets**

   - Minimum 44x44px touch targets
   - Generous spacing between interactive elements
   - Clear visual feedback on interaction

3. **Error Recovery**

   - Error boundary catches and displays errors gracefully
   - One-click app restart
   - No technical jargon in error messages

4. **Confirmation Dialogs**

   - Prevents accidental cart item removal
   - Clear action buttons
   - Easy to cancel

5. **Loading States**

   - Skeleton screens during data loading
   - Progress indicators for async operations
   - Prevents user confusion

6. **Accessibility**

   - ARIA labels for screen readers
   - Semantic HTML structure
   - Keyboard navigation support
   - High contrast colors

7. **Performance**
   - Image optimization with Next.js Image
   - Code splitting and lazy loading
   - Memoized expensive computations
   - Efficient re-renders

## 🔐 Security Considerations

- **Payment Processing**: Currently simulated. Integrate with real payment gateway (Stripe, Square, etc.) for production
- **Data Sanitization**: User inputs are sanitized
- **Session Management**: Auto-reset prevents data leakage
- **HTTPS**: Always use HTTPS in production

## 🧪 Testing

### Run Tests (when implemented)

```bash
npm test
```

### Recommended Testing

- Unit tests for hooks and utilities
- Integration tests for cart operations
- E2E tests for complete order flow
- Accessibility testing with axe-core
- Performance testing with Lighthouse

## 📊 Performance Optimization

- **Image Optimization**: All images use Next.js Image component
- **Code Splitting**: Automatic with Next.js App Router
- **Lazy Loading**: Components loaded on demand
- **Memoization**: Expensive computations cached
- **Bundle Size**: Optimized with tree-shaking

## 🐛 Troubleshooting

### Common Issues

**Issue**: Images not loading

- **Solution**: Ensure images are in `public/` directory or configure external image domains in `next.config.js`

**Issue**: Translations not working

- **Solution**: Check that all translation keys exist in all language objects

**Issue**: Idle timer not working

- **Solution**: Ensure IdleTimer is inside KioskProvider in layout

**Issue**: Build errors

- **Solution**: Run `npm install` to ensure all dependencies are installed

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For issues and questions:

- Open an issue on GitHub
- Contact the development team
- Check the documentation

## 🎯 Future Enhancements

- [ ] Real payment gateway integration
- [ ] Order history and receipts
- [ ] Loyalty program integration
- [ ] Nutritional information display
- [ ] Allergen warnings
- [ ] Print receipt functionality
- [ ] Admin dashboard for menu management
- [ ] Analytics and reporting
- [ ] Multi-location support
- [ ] QR code ordering integration

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

---

**Built with ❤️ for modern restaurant experiences**
