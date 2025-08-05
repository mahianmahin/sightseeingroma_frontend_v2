import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import check from "../assets/check.png";
import { baseUrl } from "../utilities/Utilities";

export default function ProcessTicketsV2() {
    const agentRef = useRef(null);
    const { code } = useParams();
    const navigate = useNavigate();
    
    const [data, setData] = useState({});
    const [agentList, setAgentList] = useState([]);
    const [agentUsername, setAgentUsername] = useState("");
    const [agentCode, setAgentCode] = useState("");
    const [claimData, setClaimData] = useState(false);
    console.log(agentList);
    
    // Fetch ticket data
    useEffect(() => {
        if (code) {
            fetch(`${baseUrl}authenticate/${code}/`)
                .then(response => response.json())
                .then(data => {
                    setData(data);
                    setAgentList(data.agent_list);
                })
                .catch(error => console.error("Error fetching data:", error));
        }
    }, [code]);

    // Handle ticket claim
    function handleSubmit(event) {
        event.preventDefault();

        if (agentCode.length >= 4) {
            agentRef.current.blur();
        }

        fetch(`${baseUrl}claim/${code}/${agentUsername}/${agentCode}/`)
            .then(response => response.json())
            .then(data => {
                setClaimData(data.success);
            })
            .catch(error => console.error("Error claiming ticket:", error));
    }

    return (
        <div className="container mx-auto py-10 flex flex-col items-center mb-16">
            {!data.claimed ? (
                claimData !== true ? (
                    <>
                        <h4 className="text-center text-lg font-semibold mt-28 ">The ticket has not been claimed yet.</h4>
                        <span className="mt-2">Claim the ticket (Agents only)</span>
                        
                        <div className="bg-gray-100 p-6 rounded-md shadow-md mt-4 w-full max-w-md">
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                {/* Agent Selection */}
                                <select 
                                    required 
                                    className="w-full p-2 border rounded" 
                                    onChange={(event) => setAgentUsername(event.target.value)}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select Agent Name</option>
                                    {agentList.length !== 0 ? (
                                        agentList.map((element, index) => (
                                            <option key={index} value={element}>{element}</option>
                                        ))
                                    ) : (
                                        <option>Loading...</option>
                                    )}
                                </select>

                                {/* Agent Code Input */}
                                <input 
                                    required 
                                    ref={agentRef} 
                                    onChange={(event) => setAgentCode(event.target.value)} 
                                    value={agentCode} 
                                    className="w-full p-2 border rounded" 
                                    type="password" 
                                    placeholder="Agent Code" 
                                />

                                {/* Claim Button */}
                                <button 
                                    disabled={claimData} 
                                    className="w-full bg-2 text-white p-2 rounded  disabled:bg-gray-400" 
                                    type="submit"
                                >
                                    Claim Ticket
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center mt-20">
                        <img className="mb-2" src={check} alt="checked_image" style={{ width: '80px', height: '80px' }} />
                        <h4 className="text-green-600 text-lg font-semibold">Ticket claimed successfully!</h4>
                    </div>
                )
            ) : (
                <div className="bg-red-100 p-6 rounded-md shadow-md text-center mt-20">
                    <h3 className="text-red-600 font-semibold">{data.msg}</h3>
                    <div className="mt-2 text-sm text-gray-500">EXPIRED</div>
                </div>
            )}

            {/* Ticket Information */}
            {data.data && (
                <div className="bg-white p-6 rounded-md shadow-md mt-5 w-full max-w-md">
                    <h5 className="text-center text-lg font-semibold mb-4">Ticket Information</h5>
                    <p className="text-gray-700">
                        <b>Package:</b> {data.data.package} <br />
                        <b>Customer Name:</b> {data.data.user} <br />
                        <b>Total price:</b> €{data.data.total_price} <br />
                        <b>Total Number of Adults:</b> {data.data.adults} <br />
                        <b>Total Number of Youth:</b> {data.data.youths} <br />
                        <b>Total Number of Infants:</b> {data.data.infants} <br />
                        <b>Payment Status:</b> {data.data.paid ? "Paid" : "Unpaid"} <br />
                        <b>Selected Date:</b> {data.data.selected_date ? data.data.selected_date : "N/A"} <br />
                        <b>Package Tag:</b> {data.data.package_tag} <br />
                    </p>
                </div>
            )}
        </div>
    );
}
