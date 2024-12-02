import { MainLayout } from '../components/MainLayout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicy() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <p className="text-sm text-gray-500 mb-8 text-center">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
              <p>When you use ZeroCodeCEO, we collect the following information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Information from Google Sign-In: name, email address, and profile picture</li>
                <li>Geographic location (with your consent)</li>
                <li>Course progress and interaction data</li>
                <li>Payment information (processed securely through Stripe)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
              <p>We use the collected information for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account creation and management</li>
                <li>Providing access to course content</li>
                <li>Processing payments</li>
                <li>Tracking course progress</li>
                <li>Displaying global user distribution</li>
                <li>Improving our services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">3. Data Storage and Security</h2>
              <p>Your data is securely stored using MongoDB and protected using industry-standard security measures. We use HTTPS encryption for all data transfers.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">4. Third-Party Services</h2>
              <p>We use the following third-party services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Google Authentication for secure sign-in</li>
                <li>Stripe for payment processing</li>
                <li>MongoDB for data storage</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal data</li>
                <li>Request data deletion</li>
                <li>Opt-out of location tracking</li>
                <li>Update your information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">6. Contact Information</h2>
              <p>For any privacy-related questions or concerns, please contact us at:</p>
              <p className="mt-2">Email: bbertapeli@gmail.com</p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">7. Changes to This Policy</h2>
              <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
            </section>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
} 