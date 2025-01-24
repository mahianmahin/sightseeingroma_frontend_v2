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

    const [agentUsername, setAgentUsername] = useState('');
    const [agentCode, setAgentCode] = useState('');

    const [claimData, setClaimData] = useState(false);

    useEffect(() => {
        fetch(`${baseUrl}qr/auth/${code}/`)
            .then(response => response.json())
            .then(data => {
                setData(data);
                setAgentList(data.agent_list);
                console.log(data);
            });
    }, []);

    function handleSubmit(event) {
        event.preventDefault();

        if (event.target.value.toString().length >= 4) {
            agentRef.current.blur();
        }

        fetch(`${baseUrl}claim/${code}/${agentUsername}/${event.target.value}/`)
            .then(response => response.json())
            .then(data => {
                setClaimData(data.success);
            });
    }

    return (
        <>
            {data.claimed === false ? (
                <div className="container-box">
                    {claimData !== true ? (
                        <>
                            <h4 className="text-center text-lg font-semibold">The ticket has not been claimed yet.</h4>
                            <span className="mt-2 text-gray-600">Claim the ticket (Agents only)</span>

                            <div className="card">
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <select 
                                        required 
                                        className="input-field"
                                        onChange={event => setAgentUsername(event.target.value)}
                                    >
                                        <option value="nothing" disabled selected>Select Agent Name</option>
                                        {agentList.length !== 0 
                                            ? agentList.map((element, index) => (
                                                <option key={index} value={element}>{element}</option>
                                            )) 
                                            : <option>Loading...</option>
                                        }
                                    </select>

                                    <input 
                                        required 
                                        ref={agentRef} 
                                        onChange={event => {
                                            setAgentCode(event.target.value);
                                            handleSubmit(event);
                                        }} 
                                        value={agentCode} 
                                        className={`input-field ${
                                            claimData === false ? "border-gray-300" : "border-green-500"
                                        }`} 
                                        type="password" 
                                        placeholder="Agent Code" 
                                    />

                                    <button 
                                        disabled={claimData} 
                                        onClick={handleSubmit} 
                                        className="btn-primary"
                                        type="submit"
                                    >
                                        Claim Ticket
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="success-message">
                            <img className="mb-2 w-12 h-12" src={check} alt="checked_image" />
                            <h4 className="text-lg font-semibold text-green-600">Ticket claimed successfully!</h4>
                        </div>
                    )}

                    <div className="card">
                        <h5 className="text-center text-xl font-bold mb-4">Ticket Information</h5>
                        {data.data && (
                            <div className="text-gray-700">
                                <p className="mt-3">
                                    <b>Package:</b> {data.data.package} <br />
                                    <b>Customer Name:</b> {data.data.user} <br />
                                    <b>Total Price:</b> €{data.data.total_price} <br />
                                    <b>Total Adults:</b> {data.data.adults} <br />
                                    <b>Total Youth:</b> {data.data.youths} <br />
                                    <b>Total Infants:</b> {data.data.infants} <br />
                                    <b>Payment Status:</b> {data.data.paid ? "Paid" : "Unpaid"} <br />
                                    <b>Selected Date:</b> {data.data.selected_date ?? "N/A"} <br />
                                    <b>Package Tag:</b> {data.data.package_tag} <br />
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="container-box">
                    {data.data && (
                        <div className="expired-message">
                            <h3 className="text-xl font-bold">{data.msg}</h3>
                            <div className="divider"></div>
                            <div className="text-red-600 font-semibold">Expired</div>

                            <p className="mt-3 text-gray-700">
                                <b>Package:</b> {data.data.package} <br />
                                <b>Customer Name:</b> {data.data.user} <br />
                                <b>Total Price:</b> €{data.data.total_price} <br />
                                <b>Total Adults:</b> {data.data.adults} <br />
                                <b>Total Youth:</b> {data.data.youths} <br />
                                <b>Total Infants:</b> {data.data.infants} <br />
                                <b>Payment Status:</b> {data.data.paid ? "Paid" : "Unpaid"} <br />
                                <b>Selected Date:</b> {data.data.selected_date ?? "N/A"} <br />
                                <b>Package Tag:</b> {data.data.package_tag} <br />
                            </p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
