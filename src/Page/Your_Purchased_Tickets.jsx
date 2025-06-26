import React, { useEffect, useState } from 'react';
import Banner2 from '../Components/Banner2/Banner2';
import { useNavigate } from 'react-router-dom';
import { baseMediaUrl, baseUrl, baseUrlHashless } from '../utilities/Utilities';



const Your_Purchased_Tickets = () => {


    const tickets = Array.from({ length: 8 }).map((_, index) => ({
        date: 'N/A',
        package: 'Hop-On Hop-Off Panoramic Rome Bus',
        price: '€28',
        claimed: 'No',
    }));

    const navigate = useNavigate();
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(`${baseUrl}dashboard/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${window.localStorage['access']}`,
            },
        }).then(response => {
            if (response.status === 401) {
                navigate('/login')
            } else {
                return response.json()
            }
        }).then(data => setData(data.data))
    }, [])






    return (
        <div className='container mx-auto'>
            <Banner2
                bannerImgmd={'/Banner/b5.png'}
                bannerImgsm={'/Banner/tikit.png'}
                title={'Your Purchased Tickets'}
                description={'View and manage all your booked tickets in one place'}
            />






            <div className="hidden md:block overflow-x-auto mx-10 mb-28 mt-10">
                <table className="min-w-full border-collapse">
                    <thead className="bg-[#F2F2F7] border-b-4 border-[#930B31] py-10">
                        <tr className=''>
                            <th className="px-4 py-4 text-left text-lg font-bold  ">
                                Selected date
                            </th>
                            <th className="px-4 py-2 text-left text-lg font-bold  ">
                                Package
                            </th>
                            <th className="px-4 py-2 text-left text-lg font-bold ">
                                Total price
                            </th>
                            <th className="px-4 py-2 text-left text-lg font-bold  ">
                                Ticket claimed
                            </th>
                            <th className="px-4 py-2 text-left text-lg font-bold">
                                QR code
                            </th>
                        </tr>
                    </thead>
                    <tbody className='border border-gray-300'>
                        {data.map((ticket, index) => (
                            <tr
                                key={index}
                                className='bg-3 border-b-2'
                            >
                                <td className="px-4 py-4 text-sm ">
                                    {ticket.selected_date === '' ? "N/A" : ticket.selected_date}
                                </td>
                                <td className="px-4 py-2 text-sm ">
                                    {ticket.package}
                                </td>
                                <td className="px-4 py-2 text-sm font-bold ">
                                    {ticket.total_price}
                                </td>
                                <td className="px-4 py-2 text-sm font-semibold ">
                                    {ticket.qr_code_scanned ? "Yes" : "No"}
                                </td>
                                <td className="px-4 py-2 text-sm text-red-800">
                                    <a href={`${baseUrlHashless}${ticket.qr_code}`} download>Save</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


















            {/* Tickets List */}
            <div className=" block md:hidden   my-10 px-3 ">
                {/* Example Ticket */}
                {data.map((ticket, index) => (
                    <div
                        key={index}
                        className="border rounded-lg my-7 p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between bg-3"
                    >
                        <div className='flex flex-col space-y-3'>
                            <div className='flex justify-between items-center'>
                                <p><strong>Ticket selected:</strong>{ticket.selected_date === '' ? "N/A" : ticket.selected_date}</p>
                                <p><strong>Total price:</strong>  {ticket.total_price}</p>
                            </div>
                            <p><strong>Package:</strong>        {ticket.package}</p>

                            <div className='flex justify-between items-center'>
                                <p><strong>Ticket claimed:</strong> {ticket.qr_code_scanned ? "Yes" : "No"}</p>
                                <p><strong>QR Code:</strong> <button className='text-red-500'><a href={`${baseUrlHashless}${ticket.qr_code}`} download>Save</a></button></p>
                            </div>
                        </div>

                    </div>
                ))}
            </div>




        </div>
    );
};

export default Your_Purchased_Tickets;