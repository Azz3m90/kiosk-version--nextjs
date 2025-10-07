'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { WelcomeSection } from '@/components/sections/WelcomeSection';
import { OrderTypeSection } from '@/components/sections/OrderTypeSection';
import { FoodSection } from '@/components/sections/FoodSection';
import { DrinksSection } from '@/components/sections/DrinksSection';
import { ReviewSection } from '@/components/sections/ReviewSection';
import { PaymentSection } from '@/components/sections/PaymentSection';
import { BackToTop } from '@/components/ui/BackToTop';
import { FloatingCartButton } from '@/components/ui/FloatingCartButton';
import { useKiosk } from '@/context/KioskContext';

export default function Home() {
  const { currentStep } = useKiosk();

  // Show welcome and order type screens without sidebar and header
  if (currentStep === 'welcome') {
    return <WelcomeSection />;
  }

  if (currentStep === 'orderType') {
    return <OrderTypeSection />;
  }

  // Show main app with sidebar and header for other steps
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar with integrated Cart */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-[320px] overflow-y-auto bg-transparent">
        {/* Header */}
        <Header />

        {/* Content Area */}
        <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
          {currentStep === 'food' && <FoodSection />}
          {currentStep === 'drinks' && <DrinksSection />}
          {currentStep === 'review' && <ReviewSection />}
          {currentStep === 'payment' && <PaymentSection />}
        </div>
      </main>

      {/* Floating Cart Button - Always Visible (Kiosk Best Practice) */}
      <FloatingCartButton />

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}