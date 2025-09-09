import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const ViewPDF = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [quotationData, setQuotationData] = useState(null)
  const [loading, setLoading] = useState(true)

  const formatIndianNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num)
  }

  useEffect(() => {
    const fetchQuotationData = async () => {
      try {
        console.log('Fetching quotation with ID:', id)
        const quotationResponse = await axios.get('https://computer-shop-backend-five.vercel.app/api/orders/quotations/search')
        console.log('Quotation response:', quotationResponse.data)
        
        const quotation = quotationResponse.data.data?.find(q => q._id === id)
        console.log('Found quotation:', quotation)
        
        if (!quotation) {
          console.log('No quotation found')
          setLoading(false)
          return
        }
        
        const productsWithNames = quotation.items?.map(item => {
          const product = item.product || {}
          return {
            name: item.name || product?.name || 'Product',
            orderQuantity: item.quantity,
            sellingRate: item.price,
            description: product?.description || '',
            category: product?.brand || 'No Category'
          }
        }) || []
        
        console.log('Processed products:', productsWithNames)
        
        setQuotationData({
          customer: {
            name: quotation.customerName,
            email: quotation.customerEmail,
            phone: quotation.customerPhone,
            address: quotation.address || 'Address not provided'
          },
          products: productsWithNames,
          totalAmount: quotation.totalAmount || 0,
          createdAt: quotation.createdAt
        })
      } catch (error) {
        console.error('Error fetching quotation:', error)
      }
      setLoading(false)
    }
    
    if (id) fetchQuotationData()
  }, [id])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
  }

  if (!quotationData) {
    console.log('No quotation data available')
    return <div className="flex items-center justify-center min-h-screen"><p className="text-gray-500">Quotation not found</p></div>
  }
  
  console.log('Rendering with quotation data:', quotationData)

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Action Buttons */}
      <div className="no-print">
        {/* Action Buttons - Responsive layout */}
        <div className="fixed top-4 right-4 z-50 flex flex-col sm:flex-row gap-2 lg:gap-3">
          <button 
            onClick={() => {
              const shareableUrl = `${window.location.origin}/shared-quotation/${id}`
              const message = `Computer Shop Quotation\n\nCustomer: ${quotationData.customer.name}\nTotal: ₹${quotationData.totalAmount?.toFixed(2)}\n\nView PDF: ${shareableUrl}`
              const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
              window.open(whatsappUrl, '_blank')
            }}
            className="group px-3 py-2 lg:px-4 lg:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg lg:rounded-xl hover:from-green-700 hover:to-green-800 shadow-lg lg:shadow-xl hover:shadow-xl lg:hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-1 lg:gap-2 font-medium text-sm lg:text-base"
          >
            <svg className="w-4 h-4 lg:w-5 lg:h-5 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.785"/>
            </svg>
            <span className="hidden sm:inline">WhatsApp</span>
          </button>
          <button 
            onClick={() => window.print()}
            className="group px-3 py-2 lg:px-6 lg:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg lg:rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg lg:shadow-xl hover:shadow-xl lg:hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-1 lg:gap-2 font-medium text-sm lg:text-base"
          >
            <svg className="w-4 h-4 lg:w-5 lg:h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      <div className="print-content p-4 sm:p-6 lg:p-8 mt-16 sm:mt-20">
        <button 
          onClick={() => navigate('/quotation-list')}
          className="no-print mb-4 px-3 py-2 lg:px-4 lg:py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg lg:rounded-xl hover:from-gray-700 hover:to-gray-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-1 lg:gap-2 font-medium text-sm lg:text-base"
        >
          <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="hidden sm:inline">Back</span>
        </button>
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">QUOTATION</h1>
          <p className="text-lg sm:text-xl text-gray-600">Computer Shop</p>
          <hr className="w-24 sm:w-32 mx-auto mt-4 border-gray-300" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-8 lg:mb-12">
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-3 lg:mb-4 border-b-2 border-gray-200 pb-2">Bill To:</h3>
            <div className="text-gray-700 space-y-1">
              <p className="font-semibold text-base lg:text-lg">{quotationData.customer.name}</p>
              <p>{quotationData.customer.email}</p>
              <p>{quotationData.customer.phone}</p>
              <p>{quotationData.customer.address}</p>
            </div>
          </div>
          <div className="lg:text-right">
            <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-3 lg:mb-4 border-b-2 border-gray-200 pb-2">Quote Details:</h3>
            <div className="text-gray-700 space-y-1">
              <p><span className="font-medium">Date:</span> {new Date(quotationData.createdAt).toLocaleDateString()}</p>
              <p><span className="font-medium">Quote #:</span> QT-{id?.slice(-6)}</p>
            </div>
          </div>
        </div>

        <div className="mb-8 lg:mb-12">
          <table className="w-full border-collapse border-2 border-gray-400">
            <thead>
              <tr>
                <th className="border-2 border-gray-400 px-2 sm:px-4 lg:px-6 py-2 lg:py-4 text-left text-white bg-blue-900 font-bold text-xs sm:text-sm lg:text-base">Item Description</th>
                <th className="border-2 border-gray-400 px-2 sm:px-4 lg:px-6 py-2 lg:py-4 text-center text-white bg-blue-900 font-bold text-xs sm:text-sm lg:text-base">Qty</th>
                <th className="border-2 border-gray-400 px-2 sm:px-4 lg:px-6 py-2 lg:py-4 text-right text-white bg-blue-900 font-bold text-xs sm:text-sm lg:text-base">Unit Price</th>
                <th className="border-2 border-gray-400 px-2 sm:px-4 lg:px-6 py-2 lg:py-4 text-right text-white bg-blue-900 font-bold text-xs sm:text-sm lg:text-base">Total</th>
              </tr>
            </thead>
            <tbody>
              {quotationData.products.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="border border-gray-300 px-2 sm:px-4 lg:px-6 py-2 lg:py-4">
                    <div>
                      <p className="font-semibold text-gray-800 text-xs sm:text-sm lg:text-base">{item.name}</p>
                      {item.description && item.description !== 'N/A' && item.description.trim() && (
                        <p className="text-xs sm:text-sm text-gray-600">{item.description}</p>
                      )}
                      {item.category && <p className="text-xs text-gray-500">{item.category}</p>}
                    </div>
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-4 lg:px-6 py-2 lg:py-4 text-center font-medium text-xs sm:text-sm lg:text-base">{item.orderQuantity}</td>
                  <td className="border border-gray-300 px-2 sm:px-4 lg:px-6 py-2 lg:py-4 text-right font-medium text-xs sm:text-sm lg:text-base">₹{formatIndianNumber(item.sellingRate)}</td>
                  <td className="border border-gray-300 px-2 sm:px-4 lg:px-6 py-2 lg:py-4 text-right font-bold text-xs sm:text-sm lg:text-base">₹{formatIndianNumber((item.sellingRate * item.orderQuantity).toFixed(2))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-8 lg:mb-12">
          <div className="w-full sm:w-80 bg-gray-50 p-4 lg:p-6 rounded-lg border-2 border-gray-300">
            <div className="flex justify-between py-2 lg:py-3 border-b border-gray-300 text-sm lg:text-lg">
              <span className="font-medium">Subtotal:</span>
              <span className="font-semibold">₹{formatIndianNumber(quotationData.totalAmount.toFixed(2))}</span>
            </div>
            <div className="flex justify-between py-2 lg:py-3 border-b border-gray-300 text-sm lg:text-lg">
              <span className="font-medium">Tax (0%):</span>
              <span className="font-semibold">₹0.00</span>
            </div>
            <div className="flex justify-between py-3 lg:py-4 font-bold text-lg lg:text-2xl text-gray-800 border-t-2 border-gray-400 mt-2">
              <span>TOTAL:</span>
              <span>₹{formatIndianNumber(quotationData.totalAmount.toFixed(2))}</span>
            </div>
          </div>
        </div>

        <div className="text-center border-t-2 border-gray-300 pt-6 lg:pt-8">
          <p className="text-base lg:text-lg font-medium text-gray-700 mb-2">Thank you for your business!</p>
          <p className="text-sm lg:text-base text-gray-600">This quotation is valid for 30 days from the date of issue.</p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page { margin: 0; size: A4; }
          body * { visibility: hidden; }
          .print-content, .print-content * { visibility: visible; }
          .print-content { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  )
}

export default ViewPDF