/**
 * ProcessTickets island – ticket verification & agent claim page.
 * Receives `code` prop from the Astro page (from URL param).
 */
import { useEffect, useRef, useState } from 'react';
import { FaCheckCircle, FaUserCheck, FaShieldAlt, FaTimes, FaClipboardCheck, FaExclamationTriangle } from 'react-icons/fa';

const API_URL = 'https://api.sightseeingroma.com';

export default function ProcessTicketsIsland({ code }) {
  const agentRef = useRef(null);
  const [data, setData] = useState({});
  const [agentList, setAgentList] = useState([]);
  const [agentUsername, setAgentUsername] = useState('');
  const [agentCode, setAgentCode] = useState('');
  const [claimData, setClaimData] = useState(false);

  useEffect(() => {
    if (code) {
      fetch(`${API_URL}/authenticate/${code}/`)
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        })
        .then((d) => {
          setData(d);
          // agent_list may be at top level or nested
          const agents = d.agent_list || d.data?.agent_list || [];
          setAgentList(agents);
        })
        .catch((err) => {
          console.error('Verify fetch error:', err);
          setData({ error: true });
        });
    }
  }, [code]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (agentCode.length >= 4 && agentRef.current) agentRef.current.blur();

    fetch(`${API_URL}/claim/${code}/${agentUsername}/${agentCode}/`)
      .then((r) => r.json())
      .then((d) => setClaimData(d.success))
      .catch(console.error);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          {!data.claimed ? (
            claimData !== true ? (
              <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Claim Form */}
                <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mt-10">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#930B31] rounded-full mb-4">
                      <FaShieldAlt className="text-white text-2xl" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Ticket Verification</h2>
                    <p className="text-gray-600">This ticket has not been claimed yet. Only authorized agents can process this ticket.</p>
                  </div>

                  <div className="bg-[#F2F2F7] p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FaUserCheck className="mr-2 text-[#930B31]" />Agent Authentication
                    </h3>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Agent Name</label>
                        <select required className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#930B31]"
                          onChange={(e) => setAgentUsername(e.target.value)} defaultValue="">
                          <option value="" disabled>Choose your agent name</option>
                          {agentList.length > 0 ? agentList.map((el, i) => (
                            <option key={i} value={el}>{el}</option>
                          )) : <option disabled>Loading agents...</option>}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Agent Security Code</label>
                        <input required ref={agentRef} value={agentCode}
                          onChange={(e) => setAgentCode(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#930B31]"
                          type="password" placeholder="Enter your secure agent code" />
                      </div>

                      <button disabled={claimData} type="submit"
                        className="w-full bg-[#930B31] hover:bg-red-800 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        <FaClipboardCheck />{claimData ? 'Processing...' : 'Claim Ticket'}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mt-10">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500 rounded-full mb-4">
                      <FaExclamationTriangle className="text-white text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Security Notice</h3>
                  </div>
                  <div className="space-y-4 text-sm text-gray-600">
                    {[
                      'Only authorized agents with valid credentials can claim tickets',
                      'All ticket claims are logged and monitored for security purposes',
                      'Unauthorized access attempts will be reported to administration',
                      'For assistance, contact your supervisor or technical support',
                    ].map((text, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#930B31] rounded-full mt-2" />
                        <p>{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center mt-10">
                <div className="bg-white rounded-lg shadow-md p-8 md:p-12 max-w-md mx-auto">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                    <FaCheckCircle className="text-green-600 text-3xl" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-green-600 mb-4">Ticket Claimed Successfully!</h2>
                  <p className="text-gray-600 mb-6">The ticket has been successfully processed and claimed by an authorized agent.</p>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">Ticket has been validated successfully</p>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="text-center mt-10">
              <div className="bg-white rounded-lg shadow-md p-8 md:p-12 max-w-md mx-auto border-l-4 border-red-500">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                  <FaTimes className="text-red-600 text-3xl" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-red-600 mb-4">Ticket Already Claimed</h2>
                <p className="text-gray-600 mb-4">{data.msg}</p>
                <div className="bg-red-50 p-4 rounded-lg">
                  <span className="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">EXPIRED</span>
                </div>
              </div>
            </div>
          )}

          {/* Ticket Information */}
          {data.data && (
            <div className="mt-8">
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mr-3">
                    <FaClipboardCheck className="text-blue-600 text-xl" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800">Ticket Information</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {[
                      ['Package', data.data.package],
                      ['Customer Name', data.data.user],
                      ['Payment Status', data.data.paid ? '✓ PAID' : '✗ Unpaid'],
                      ['Package Tag', data.data.package_tag],
                    ].map(([label, val], i) => (
                      <div key={i} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-semibold text-gray-700">{label}:</span>
                        <span className={`${label === 'Payment Status' ? (data.data.paid ? 'text-green-600' : 'text-red-600') : 'text-gray-900'} ${label === 'Package Tag' ? 'font-mono text-sm' : ''}`}>{val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    {[
                      ['Adults', data.data.adults],
                      ['Youth', data.data.youths],
                      ['Infants', data.data.infants],
                      ['Selected Date', data.data.selected_date || 'N/A'],
                    ].map(([label, val], i) => (
                      <div key={i} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-semibold text-gray-700">{label}:</span>
                        <span className="text-gray-900">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
