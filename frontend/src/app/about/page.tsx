import Breadcrumb from '@/components/ui/breadcrumb';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'About Us', active: true }
        ]} />
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">About NewsRoom</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 text-lg mb-6">
                Welcome to NewsRoom, your trusted source for the latest news and insights from around the world. 
                We are committed to delivering accurate, timely, and comprehensive coverage of the stories that matter most.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-6">
                At NewsRoom, our mission is to inform, educate, and engage our readers with high-quality journalism. 
                We strive to provide diverse perspectives on current events, technology, business, sports, and entertainment.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Cover</h2>
              <ul className="text-gray-600 mb-6 space-y-2">
                <li>• Breaking news and current events</li>
                <li>• Technology and innovation</li>
                <li>• Business and finance</li>
                <li>• Sports and entertainment</li>
                <li>• Health and lifestyle</li>
                <li>• Politics and world affairs</li>
              </ul>
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Team</h2>
              <p className="text-gray-600 mb-6">
                Our dedicated team of journalists, editors, and contributors work around the clock to bring you 
                the most relevant and important stories. We believe in the power of quality journalism to make 
                a positive impact on society.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600">
                Have a story tip or feedback? We'd love to hear from you. 
                Visit our <a href="/contact" className="text-red-600 hover:underline">contact page</a> to get in touch.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
