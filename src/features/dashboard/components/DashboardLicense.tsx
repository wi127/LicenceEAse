'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Monitor, 
  Building2, 
  Globe, 
  CheckCircle2, 
  Info, 
  Clock3, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react'

export default function DashboardLicense() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const licenseCategories = [
    {
      id: 'application-service-provider',
      title: 'Application Service Provider',
      icon: <Monitor className="w-8 h-8" />,
      description: 'Provide software applications and services to customers over the internet, including SaaS, web applications, and cloud-based solutions.',
      requirements: [
        'Valid business registration certificate',
        'Technical infrastructure documentation',
        'Data protection and privacy compliance certificate',
        'Service level agreement (SLA) templates',
        'Business continuity and disaster recovery plan',
        'Professional liability insurance certificate',
        'Technical team qualifications and certifications'
      ],
      guidelines: [
        'Ensure your technical infrastructure meets minimum security standards',
        'Provide detailed documentation of your service offerings',
        'Include proof of data backup and recovery procedures',
        'Submit evidence of staff technical training and certifications',
        'Demonstrate compliance with international data protection standards'
      ],
      processingTime: '3-5 days',
      fees: {
        application: 50000,
        license: 500000,
        renewal: 350000
      },
      validity: '2 years'
    },
    {
      id: 'network-infrastructure',
      title: 'Network Infrastructure',
      icon: <Building2 className="w-8 h-8" />,
      description: 'Deploy, maintain, and operate network infrastructure including fiber optic cables, wireless towers, data centers, and telecommunications equipment.',
      requirements: [
        'Environmental impact assessment report',
        'Technical specifications and equipment documentation',
        'Safety and health compliance certificates',
        'Site acquisition agreements and permits',
        'Engineering plans and network topology diagrams',
        'Equipment supplier certifications',
        'Installation and maintenance team qualifications'
      ],
      guidelines: [
        'Conduct thorough environmental impact assessments for all installations',
        'Ensure all equipment meets international telecommunications standards',
        'Provide detailed network coverage maps and expansion plans',
        'Include emergency response and maintenance procedures',
        'Submit proof of technical staff qualifications and training'
      ],
      processingTime: '3-5 days',
      fees: {
        application: 50000,
        license: 600000,
        renewal: 400000
      },
      validity: '3 years'
    },
    {
      id: 'network-service-provider',
      title: 'Network Service Provider',
      icon: <Globe className="w-8 h-8" />,
      description: 'Provide internet connectivity, telecommunications services, and network access to end users including ISP services, mobile networks, and enterprise connectivity.',
      requirements: [
        'Spectrum allocation request and documentation',
        'Network coverage plans and service area maps',
        'Quality of service (QoS) guarantees and metrics',
        'Interconnection agreements with other providers',
        'Customer service and support procedures',
        'Billing and payment processing systems documentation',
        'Network security and monitoring capabilities'
      ],
      guidelines: [
        'Provide comprehensive network coverage plans with timeline',
        'Demonstrate ability to meet quality of service requirements',
        'Include detailed customer support and complaint resolution procedures',
        'Submit evidence of network monitoring and security measures',
        'Provide financial projections and sustainability plans'
      ],
      processingTime: '3-5 days',
      fees: {
        application: 50000,
        license: 400000,
        renewal: 250000
      },
      validity: '5 years'
    }
  ]

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  const handleStartApplication = () => {
    if (selectedCategory) {
      router.push(`/submit-application?category=${selectedCategory}`)
    }
  }

  const selectedCategoryData = licenseCategories.find(cat => cat.id === selectedCategory)

  return (
    <div className="min-h-screen">
      <div className="px-4 sm:px-6 py-8 max-w-7xl mx-auto">
        <div className="mb-10">
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-6 group"
          >
            <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center shadow-sm group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-all">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </div>
            Back to Dashboard
          </button>
          
          <div className='inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-2'>
            License Application
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Apply for a <span className='text-blue-600 dark:text-blue-400'>License</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 max-w-xl">
            Select the license category that best fits your business needs to begin the application process.
          </p>
        </div>

        {!selectedCategory ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {licenseCategories.map((category) => (
              <div 
                key={category.id}
                className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
                onClick={() => handleCategorySelect(category.id)}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Main Fee</p>
                    <p className="text-lg font-black text-blue-600 dark:text-blue-400">RWF {(category.fees.license / 1000).toFixed(0)}k</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">{category.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8 flex-grow">
                  {category.description}
                </p>
                  
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-500 dark:text-gray-400">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-gray-900/40 flex items-center justify-center text-blue-600">
                      <Clock3 className="w-4 h-4" />
                    </div>
                    Processing: {category.processingTime}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-500 dark:text-gray-400">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-gray-900/40 flex items-center justify-center text-blue-600">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    Validity: {category.validity}
                  </div>
                </div>

                <button className="w-full bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 font-bold py-4 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm flex items-center justify-center gap-2">
                  <span>Select Category</span>
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all duration-300" />
                </button>
              </div>
            ))}
          </div>
        ) : selectedCategoryData && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-8 sm:p-12 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center flex-shrink-0">
                    {selectedCategoryData.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{selectedCategoryData.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-xl leading-relaxed">
                      {selectedCategoryData.description}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="bg-gray-50 dark:bg-gray-900 px-6 py-3 rounded-2xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap border border-gray-100 dark:border-gray-800"
                >
                  Change Category
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-10 mb-12">
                <div className="bg-gray-50/50 dark:bg-gray-900/20 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-blue-600">📝</span>
                    Required Documents
                  </h3>
                  <ul className="space-y-4">
                    {selectedCategoryData.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-4">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50/50 dark:bg-gray-900/20 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-blue-600">📋</span>
                    Application Guidelines
                  </h3>
                  <ul className="space-y-4">
                    {selectedCategoryData.guidelines.map((guideline, index) => (
                      <li key={index} className="flex items-start gap-4">
                        <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-black mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">{guideline}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 px-4">Fee Structure</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 text-center shadow-sm">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Application</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{selectedCategoryData.fees.application.toLocaleString()}</p>
                    <p className="text-xs font-bold text-blue-600 mt-1">RWF</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 text-center shadow-sm">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">License Fee</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{selectedCategoryData.fees.license.toLocaleString()}</p>
                    <p className="text-xs font-bold text-blue-600 mt-1">RWF</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 text-center shadow-sm">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Renewal</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{selectedCategoryData.fees.renewal.toLocaleString()}</p>
                    <p className="text-xs font-bold text-blue-600 mt-1">RWF</p>
                  </div>
                  <div className="bg-blue-600 rounded-3xl p-6 text-center text-white shadow-lg shadow-blue-500/20">
                    <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest mb-2">Validity</p>
                    <p className="text-2xl font-black">{selectedCategoryData.validity}</p>
                    <div className="flex items-center justify-center gap-1 mt-1 text-blue-200">
                      <Clock3 className="w-3 h-3" />
                      <p className="text-xs font-bold">Standard Term</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-[2rem] p-8 mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Info className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-amber-900 dark:text-amber-500 text-lg">Important Information</h4>
                </div>
                <ul className="space-y-3 text-sm font-medium text-amber-800 dark:text-amber-600/80">
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div> Processing time typically takes {selectedCategoryData.processingTime}</li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div> All uploaded documents must be clearly readable PDF files</li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div> System reviews happen strictly on a first-come, first-served basis</li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div> You will receive instant email notifications upon status changes</li>
                </ul>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-gray-800">
                <button 
                  onClick={handleStartApplication}
                  className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-3 group"
                >
                  <span>Begin Application</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
