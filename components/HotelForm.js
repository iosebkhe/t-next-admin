/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { ReactSortable } from "react-sortablejs";
import { withSwal } from "react-sweetalert2";

function HotelForm({
  swal,
  _id,
  title: existingTitle,
  description: existingDescription,
  descriptionSmall: existingDescriptionSmall,
  images: existingImages,
  categories: assignedCategories,
  availableRooms: existingAvailableRooms,
  address: existingAddress,
  phone: existingPhone,
  website: existingWebsite,
  workingHours: existingWorkingHours,
  facebook: existingFacebook,
  instagram: existingInstagram,
  tripAdvisor: existingTripAdvisor,
}) {
  const [formData, setFormData] = useState({
    title: existingTitle || '',
    description: existingDescription || '',
    descriptionSmall: existingDescriptionSmall || '',
    images: existingImages || [],
    categories: assignedCategories || [],
    availableRooms: existingAvailableRooms || '',
    address: existingAddress || '',
    phone: existingPhone || '',
    website: existingWebsite || '',
    workingHours: existingWorkingHours || '',
    facebook: existingFacebook || '',
    instagram: existingInstagram || '',
    tripAdvisor: existingTripAdvisor || '',
  });

  const [goToHotels, setGoToHotels] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const router = useRouter();

  useEffect(() => {
    axios.get('/api/categories').then(result => {
      setFetchedCategories(result.data);
    });
  }, []);

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = fetchedCategories.filter(category =>
      category.name.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredCategories(filtered);
  }, [searchTerm, fetchedCategories]);

  const handleCategoryChange = (categoryId) => {
    const category = fetchedCategories.find(cat => cat._id === categoryId);
    if (!category) {
      console.error('Category not found:', categoryId);
      return;
    }

    setFormData(prevData => {
      const updatedCategories = prevData.categories.find(cat => cat._id === categoryId)
        ? prevData.categories.filter(cat => cat._id !== categoryId)
        : [...prevData.categories, category];

      return { ...prevData, categories: updatedCategories };
    });
  };

  const handleInputChange = (field) => (ev) => {
    setFormData(prevData => ({ ...prevData, [field]: ev.target.value }));
  };

  const saveHotel = async (ev) => {
    ev.preventDefault();
    if (_id) {
      await axios.put('/api/hotels', { ...formData, _id });
    } else {
      await axios.post('/api/hotels', formData);
    }
    setGoToHotels(true);
  };

  const uploadImages = async (ev) => {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      const res = await axios.post('/api/upload', data);
      setFormData(prevData => ({
        ...prevData,
        images: [...prevData.images, ...res.data.links],
      }));
      setIsUploading(false);
    }
  };

  const confirmDeleteImage = (link) => {
    swal.fire({
      title: 'ნამდვილად გსურთ სურათის წაშლა?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d55',
      cancelButtonText: 'დახურვა',
      confirmButtonText: 'წაშლა',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        await deleteImage(link);
      }
    });
  };

  const deleteImage = async (link) => {
    const key = link.split('/').pop();
    await axios.post('/api/delete', { key });
    setFormData(prevData => ({
      ...prevData,
      images: prevData.images.filter(image => image !== link),
    }));
  };

  const updateImagesOrder = (images) => {
    setFormData(prevData => ({ ...prevData, images }));
  };

  if (goToHotels) {
    router.push('/hotels');
  }

  return (
    <form onSubmit={saveHotel}>
      <label>სახელი</label>
      <input
        type="text"
        placeholder="სასტუმროს სახელი"
        value={formData.title}
        onChange={handleInputChange('title')}
      />

      <div>
        <label className="my-3 inline-block">კატეგორიები</label>
        <div>
          <label>კატეგორიის ძებნა</label>
          <input
            type="text"
            placeholder="მოძებნე კატეგორია"
            value={searchTerm}
            onChange={ev => setSearchTerm(ev.target.value)}
          />
        </div>

        <div className="grid grid-cols-4 gap-2 p-3 shadow-lg max-h-32 overflow-auto mb-5">
          {filteredCategories.map(category => (
            <div key={category._id}>
              <label className="flex items-center gap-1 text-base">
                {category.name}
                <input
                  className="w-auto p-0 m-0"
                  type="checkbox"
                  value={category._id}
                  checked={formData.categories.find(cat => cat._id === category._id)}
                  onChange={() => handleCategoryChange(category._id)}
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <label>ფოტოები</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          list={formData.images}
          className="flex flex-wrap gap-1"
          setList={updateImagesOrder}
        >
          {formData.images.map(link => (
            <div key={link} className="h-44 bg-white p-4 shadow-sm rounded-sm border border-gray-200 relative">
              <img src={link} alt="" className="rounded-lg w-auto" />
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 cursor-pointer"
                onClick={() => confirmDeleteImage(link)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <div>სურათის დამატება</div>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
      </div>

      <label>სრული აღწერა</label>
      <textarea
        placeholder="სრული აღწერა"
        value={formData.description}
        onChange={handleInputChange('description')}
      />

      <label>მოკლე აღწერა</label>
      <textarea
        placeholder="მოკლე აღწერა"
        value={formData.descriptionSmall}
        onChange={handleInputChange('descriptionSmall')}
      />

      <label>ოთახების რაოდენობა</label>
      <input
        type="number"
        placeholder="ოთახების რაოდენობა"
        value={formData.availableRooms}
        onChange={handleInputChange('availableRooms')}
      />

      <label>მისამართი</label>
      <input
        type="text"
        placeholder="მისამართი"
        value={formData.address}
        onChange={handleInputChange('address')}
      />

      <label>ტელეფონი</label>
      <input
        type="text"
        placeholder="ტელეფონი"
        value={formData.phone}
        onChange={handleInputChange('phone')}
      />

      <label>ვებსაიტი</label>
      <input
        type="text"
        placeholder="ვებსაიტი"
        value={formData.website}
        onChange={handleInputChange('website')}
      />

      <label>სამუშაო საათები</label>
      <input
        type="text"
        placeholder="სამუშაო საათები"
        value={formData.workingHours}
        onChange={handleInputChange('workingHours')}
      />

      <label>ფეისბუქი</label>
      <input
        type="text"
        placeholder="ფეისბუქი"
        value={formData.facebook}
        onChange={handleInputChange('facebook')}
      />

      <label>ინსტაგრამი</label>
      <input
        type="text"
        placeholder="ინსტაგრამი"
        value={formData.instagram}
        onChange={handleInputChange('instagram')}
      />

      <label>ტრიპ ადვაიზორი</label>
      <input
        type="text"
        placeholder="ტრიპ ადვაიზორი"
        value={formData.tripAdvisor}
        onChange={handleInputChange('tripAdvisor')}
      />

      <button type="submit" className="btn-primary">
        {isUploading ? 'დამატება...' : 'დამატება'}
      </button>
    </form>
  );
}

export default withSwal(({ swal, ...hotelInfo }, ref) => (
  <HotelForm swal={swal} {...hotelInfo} ref={ref} />
));
