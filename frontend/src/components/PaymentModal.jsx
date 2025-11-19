// src/components/PaymentModal.jsx
export default function PaymentModal({ reservation, onClose, onSuccess }) {
  const downpayment = 300;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
        <h2 className="text-3xl font-bold text-[#5C3A2E] mb-6 text-center">Complete Your Reservation</h2>

        <ReservationSummary reservation={reservation} />

        <div className="my-8 p-6 bg-[#FFF5E1] rounded-xl">
          <p className="text-xl font-bold text-[#5C3A2E]">Downpayment Required:</p>
          <p className="text-4xl font-bold text-[#5C3A2E]">₱{downpayment}</p>
          <p className="text-sm text-gray-600 mt-2">Balance payable on-site</p>
        </div>

        <div className="space-y-4">
          <p className="font-semibold text-[#5C3A2E]">Payment Method:</p>
          <div className="grid grid-cols-3 gap-4">
            <button className="p-6 border-2 border-[#E9D3BE] rounded-xl hover:border-[#5C3A2E] font-bold">
              GCash
            </button>
            <button className="p-6 border-2 border-[#E9D3BE] rounded-xl hover:border-[#5C3A2E] font-bold">
              Card
            </button>
            <button className="p-6 border-2 border-[#E9D3BE] rounded-xl hover:border-[#5C3A2E] font-bold">
              Cash On-Site
            </button>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onSuccess}
            className="flex-1 py-5 bg-[#5C3A2E] text-white text-xl font-bold rounded-xl hover:bg-[#4a2e24]"
          >
            Confirm & Pay ₱{downpayment}
          </button>
          <button
            onClick={onClose}
            className="px-8 py-5 border-2 border-red-600 text-red-600 font-bold rounded-xl hover:bg-red-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}