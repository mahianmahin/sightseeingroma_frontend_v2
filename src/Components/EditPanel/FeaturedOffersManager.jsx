import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaClock, FaTag, FaImage } from 'react-icons/fa';
import { baseUrl, baseUrlHashless } from '../../utilities/Utilities';

const FeaturedOffersManager = ({ isEditor }) => {
  const [offers, setOffers] = useState([]);
  const [busPackages, setBusPackages] = useState([]);
  const [museumPackages, setMuseumPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Original prices from selected package
  const [originalPrices, setOriginalPrices] = useState({
    adult: '',
    youth: '',
    infant: ''
  });
  
  // Form state for editing/creating
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState({
    package_type: 'bus',
    bus_package: '',
    museum_package: '',
    offer_title: '',
    offer_description: '',
    badge_text: 'Limited-Time Offer',
    offer_adult_price: '',
    offer_youth_price: '',
    offer_infant_price: '',
    offer_start: '',
    offer_end: '',
    offer_image: null,
    is_active: true,
    display_order: 0,
  });
  
  // Image upload state
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (isEditor) {
      fetchData();
    }
  }, [isEditor]);

  // Auto-fetch prices when package is selected
  const handlePackageSelect = (packageId) => {
    const packageType = formData.package_type;
    const packages = packageType === 'bus' ? busPackages : museumPackages;
    const selectedPackage = packages.find(pkg => pkg.id === parseInt(packageId));
    
    if (selectedPackage) {
      const adultPrice = selectedPackage.adult_price || selectedPackage.price || '';
      const youthPrice = selectedPackage.youth_price || selectedPackage.price || '';
      const infantPrice = selectedPackage.infant_price || '0';
      
      setOriginalPrices({
        adult: adultPrice,
        youth: youthPrice,
        infant: infantPrice
      });
      
      setFormData(prev => ({
        ...prev,
        [packageType === 'bus' ? 'bus_package' : 'museum_package']: packageId,
        offer_adult_price: adultPrice,
        offer_youth_price: youthPrice,
        offer_infant_price: infantPrice,
        offer_title: prev.offer_title || selectedPackage.title || '',
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [packageType === 'bus' ? 'bus_package' : 'museum_package']: packageId,
      }));
      setOriginalPrices({ adult: '', youth: '', infant: '' });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('access');
      const headers = { 'Authorization': `Bearer ${accessToken}` };

      // Fetch all data in parallel
      const [offersRes, packagesRes] = await Promise.all([
        fetch(`${baseUrl}featured-offers/all/`, { headers }),
        fetch(`${baseUrl}featured-offers/packages/`)
      ]);

      const offersData = await offersRes.json();
      const packagesData = await packagesRes.json();

      if (offersData.status === 200) setOffers(offersData.data);
      if (packagesData.status === 200) {
        setBusPackages(packagesData.bus_packages || []);
        setMuseumPackages(packagesData.museum_packages || []);
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      package_type: 'bus',
      bus_package: '',
      museum_package: '',
      offer_title: '',
      offer_description: '',
      badge_text: 'Limited-Time Offer',
      offer_adult_price: '',
      offer_youth_price: '',
      offer_infant_price: '',
      offer_start: '',
      offer_end: '',
      offer_image: null,
      is_active: true,
      display_order: 0,
    });
    setOriginalPrices({ adult: '', youth: '', infant: '' });
    setImagePreview(null);
    setEditingOffer(null);
    setError('');
    setSuccess('');
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    setUploadingImage(true);
    try {
      const accessToken = localStorage.getItem('access');
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('alt_text', formData.offer_title || 'Offer Image');

      const response = await fetch(`${baseUrl}upload-media/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
        body: formDataUpload,
      });

      const data = await response.json();
      if (response.ok && data.id) {
        setFormData(prev => ({ ...prev, offer_image: data.id }));
      } else {
        setError('Failed to upload image');
      }
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    
    // Format date for input (date only, not datetime)
    let offerStart = '';
    let offerEnd = '';
    if (offer.offer_start) {
      const date = new Date(offer.offer_start);
      offerStart = date.toISOString().slice(0, 10);
    }
    if (offer.offer_end) {
      const date = new Date(offer.offer_end);
      offerEnd = date.toISOString().slice(0, 10);
    }
    
    // Set original prices from the offer's package details
    const originalAdult = offer.bus_package_details?.adult_price || offer.museum_package_details?.adult_price || '';
    const originalYouth = offer.bus_package_details?.youth_price || offer.museum_package_details?.youth_price || '';
    const originalInfant = offer.bus_package_details?.infant_price || offer.museum_package_details?.infant_price || '0';
    
    setOriginalPrices({
      adult: originalAdult,
      youth: originalYouth,
      infant: originalInfant
    });
    
    // Set image preview if exists
    if (offer.offer_image_details?.file) {
      setImagePreview(offer.offer_image_details.file);
    } else {
      setImagePreview(null);
    }

    setFormData({
      package_type: offer.package_type || 'bus',
      bus_package: offer.bus_package || '',
      museum_package: offer.museum_package || '',
      offer_title: offer.offer_title || '',
      offer_description: offer.offer_description || '',
      badge_text: offer.badge_text || 'Limited-Time Offer',
      offer_adult_price: offer.offer_adult_price || '',
      offer_youth_price: offer.offer_youth_price || '',
      offer_infant_price: offer.offer_infant_price || '0',
      offer_start: offerStart,
      offer_end: offerEnd,
      offer_image: offer.offer_image || null,
      is_active: offer.is_active,
      display_order: offer.display_order || 0,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const accessToken = localStorage.getItem('access');
      const url = editingOffer 
        ? `${baseUrl}featured-offers/${editingOffer.id}/update/`
        : `${baseUrl}featured-offers/create/`;
      
      const method = editingOffer ? 'PUT' : 'POST';

      // Use original price if offer price field is empty or unchanged
      const adultPrice = formData.offer_adult_price !== '' ? parseFloat(formData.offer_adult_price) : parseFloat(originalPrices.adult) || null;
      const youthPrice = formData.offer_youth_price !== '' ? parseFloat(formData.offer_youth_price) : parseFloat(originalPrices.youth) || null;
      const infantPrice = formData.offer_infant_price !== '' ? parseFloat(formData.offer_infant_price) : parseFloat(originalPrices.infant) || 0;

      // Prepare data
      const submitData = {
        package_type: formData.package_type,
        bus_package: formData.package_type === 'bus' ? formData.bus_package : null,
        museum_package: formData.package_type === 'museum' ? formData.museum_package : null,
        offer_title: formData.offer_title,
        offer_description: formData.offer_description,
        badge_text: formData.badge_text,
        offer_adult_price: adultPrice,
        offer_youth_price: youthPrice,
        offer_infant_price: infantPrice,
        offer_start: formData.offer_start ? formData.offer_start : null,
        offer_end: formData.offer_end ? formData.offer_end : null,
        offer_image: formData.offer_image || null,
        is_active: formData.is_active,
        display_order: formData.display_order || 0,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok && (data.status === 200 || data.status === 201)) {
        setSuccess(editingOffer ? 'Offer updated successfully!' : 'Offer created successfully!');
        fetchData();
        resetForm();
      } else {
        setError(data.error || 'Failed to save offer');
      }
    } catch (err) {
      setError('Failed to save offer');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (offerId) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;

    try {
      const accessToken = localStorage.getItem('access');
      const response = await fetch(`${baseUrl}featured-offers/${offerId}/delete/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });

      if (response.ok) {
        setSuccess('Offer deleted successfully!');
        fetchData();
      } else {
        setError('Failed to delete offer');
      }
    } catch (err) {
      setError('Failed to delete offer');
    }
  };

  const handleToggleActive = async (offer) => {
    try {
      const accessToken = localStorage.getItem('access');
      const response = await fetch(`${baseUrl}featured-offers/${offer.id}/update/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...offer, is_active: !offer.is_active }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (err) {
      setError('Failed to update offer');
    }
  };

  if (!isEditor) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className="fixed bottom-20 right-4 z-50 bg-[#930B31] text-white hover:bg-[#7a0926] shadow-lg rounded-full p-4"
        >
          <FaTag className="mr-2" />
          Manage Offers
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-[#930B31] flex items-center gap-2">
            <FaTag />
            Featured Offers Manager
          </SheetTitle>
          <SheetDescription>
            Create and manage limited-time offers for Rome sightseeing tickets.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Create/Edit Form */}
          <div className="bg-gray-50 rounded-xl p-5 space-y-4">
            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
              {editingOffer ? <FaEdit /> : <FaPlus />}
              {editingOffer ? 'Edit Offer' : 'Create New Offer'}
            </h3>

            {/* Ticket Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Type</label>
              <select
                value={formData.package_type}
                onChange={(e) => {
                  setFormData({ ...formData, package_type: e.target.value, bus_package: '', museum_package: '' });
                  setOriginalPrices({ adult: '', youth: '', infant: '' });
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#930B31] focus:border-transparent"
              >
                <option value="bus">Bus Package</option>
                <option value="museum">Museum Package</option>
              </select>
            </div>

            {/* Package Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select {formData.package_type === 'bus' ? 'Bus' : 'Museum'} Package
              </label>
              <select
                value={formData.package_type === 'bus' ? formData.bus_package : formData.museum_package}
                onChange={(e) => handlePackageSelect(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#930B31] focus:border-transparent"
              >
                <option value="">Select a package...</option>
                {(formData.package_type === 'bus' ? busPackages : museumPackages).map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.title || pkg.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Offer Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offer Title
              </label>
              <input
                type="text"
                value={formData.offer_title}
                onChange={(e) => setFormData({ ...formData, offer_title: e.target.value })}
                placeholder="e.g., Green Line Bus – 10% OFF"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#930B31] focus:border-transparent"
              />
            </div>

            {/* Offer Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offer Description
              </label>
              <textarea
                value={formData.offer_description}
                onChange={(e) => setFormData({ ...formData, offer_description: e.target.value })}
                placeholder="Short description for the offer..."
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#930B31] focus:border-transparent"
              />
            </div>

            {/* Badge Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text</label>
              <input
                type="text"
                value={formData.badge_text}
                onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                placeholder="e.g., Limited-Time Offer"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#930B31] focus:border-transparent"
              />
            </div>

            {/* Original Prices Display */}
            {(originalPrices.adult || originalPrices.youth || originalPrices.infant) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-800 mb-2">Original Prices:</p>
                <div className="flex gap-4 text-sm text-blue-700">
                  <span>Adult: €{originalPrices.adult || 'N/A'}</span>
                  <span>Youth: €{originalPrices.youth || 'N/A'}</span>
                  <span>Infant: €{originalPrices.infant || '0'}</span>
                </div>
              </div>
            )}

            {/* Offer Prices */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offer Prices (leave empty to keep original price)
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Adult (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.offer_adult_price}
                    onChange={(e) => setFormData({ ...formData, offer_adult_price: e.target.value })}
                    placeholder={originalPrices.adult || 'Price'}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#930B31] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Youth (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.offer_youth_price}
                    onChange={(e) => setFormData({ ...formData, offer_youth_price: e.target.value })}
                    placeholder={originalPrices.youth || 'Price'}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#930B31] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Infant (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.offer_infant_price}
                    onChange={(e) => setFormData({ ...formData, offer_infant_price: e.target.value })}
                    placeholder={originalPrices.infant || '0'}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#930B31] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Offer Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaClock className="inline mr-1" />
                  Offer Start Date
                </label>
                <input
                  type="date"
                  value={formData.offer_start}
                  onChange={(e) => setFormData({ ...formData, offer_start: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#930B31] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaClock className="inline mr-1" />
                  Offer End Date
                </label>
                <input
                  type="date"
                  value={formData.offer_end}
                  onChange={(e) => setFormData({ ...formData, offer_end: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#930B31] focus:border-transparent"
                />
              </div>
            </div>

            {/* Offer Thumbnail Image (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaImage className="inline mr-1" />
                Offer Thumbnail (Optional)
              </label>
              <p className="text-xs text-gray-500 mb-2">If not uploaded, the package's default thumbnail will be used.</p>
              
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Offer thumbnail preview" 
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, offer_image: null }));
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
                
                <label className="flex-1 cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#930B31] transition-colors">
                    {uploadingImage ? (
                      <span className="text-gray-500">Uploading...</span>
                    ) : (
                      <>
                        <FaImage className="mx-auto text-2xl text-gray-400 mb-1" />
                        <span className="text-sm text-gray-500">Click to upload image</span>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              </div>
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#930B31] focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-[#930B31] rounded focus:ring-[#930B31]"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Active (visible on frontend)
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-[#930B31] hover:bg-[#7a0926] text-white font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FaSave />
                {saving ? 'Saving...' : (editingOffer ? 'Update Offer' : 'Create Offer')}
              </button>
              {editingOffer && (
                <button
                  onClick={resetForm}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <FaTimes />
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Existing Offers List */}
          <div>
            <h3 className="font-bold text-lg text-gray-800 mb-4">Current Offers ({offers.length})</h3>
            
            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-gray-100 rounded-lg h-24 animate-pulse"></div>
                ))}
              </div>
            ) : offers.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No offers created yet.</p>
            ) : (
              <div className="space-y-3">
                {offers.map((offer) => (
                  <div 
                    key={offer.id} 
                    className={`bg-white border rounded-xl p-4 ${offer.is_active ? 'border-green-200' : 'border-gray-200 opacity-60'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${offer.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {offer.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            {offer.package_type}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-800">
                          {offer.offer_title || offer.ticket_name}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Adult: €{offer.offer_adult_price} 
                          {offer.offer_youth_price && <span className="ml-2">| Youth: €{offer.offer_youth_price}</span>}
                        </p>
                        {offer.offer_end && (
                          <p className="text-xs text-[#930B31] mt-1">
                            <FaClock className="inline mr-1" />
                            Ends: {new Date(offer.offer_end).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleEdit(offer)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleToggleActive(offer)}
                          className={`p-2 rounded-lg transition-colors ${offer.is_active ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}
                          title={offer.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {offer.is_active ? '⏸' : '▶'}
                        </button>
                        <button
                          onClick={() => handleDelete(offer.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FeaturedOffersManager;
