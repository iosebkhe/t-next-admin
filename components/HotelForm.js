/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { ReactSortable } from "react-sortablejs";
import { withSwal } from "react-sweetalert2";
import Image from "next/image";

function HotelForm({ swal,
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
  const [title, setTitle] = useState(existingTitle || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [descriptionSmall, setDescriptionSmall] = useState(existingDescriptionSmall || '');
  const [categories, setCategories] = useState(() => {
    if (assignedCategories) {
      return assignedCategories;
    } else {
      return [];
    }
  });
  const [images, setImages] = useState(existingImages || []);
  const [availableRooms, setAvailableRooms] = useState(existingAvailableRooms || "");
  const [address, setAddress] = useState(existingAddress || "");
  const [phone, setPhone] = useState(existingPhone || "");
  const [website, setWebsite] = useState(existingWebsite || "");
  const [workingHours, setWorkingHours] = useState(existingWorkingHours || "");
  const [facebook, setFacebook] = useState(existingFacebook || "");
  const [instagram, setInstagram] = useState(existingInstagram || "");
  const [tripAdvisor, setTripAdvisor] = useState(existingTripAdvisor || "");

  const [goToHotels, setGoToHotels] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fetchedCategories, setFetchedCategories] = useState([]);

  const router = useRouter();

  useEffect(() => {
    axios.get('/api/categories').then(result => {
      setFetchedCategories(result.data);
    });
  }, []);


  const handleCategoryChange = (categoryId) => {
    const category = fetchedCategories.find((cat) => cat._id === categoryId);

    if (!category) {
      console.error('Category not found:', categoryId);
      return;
    }

    if (categories.find((cat) => cat._id === categoryId)) {
      setCategories((prevCategories) =>
        prevCategories.filter((cat) => cat._id !== categoryId)
      );
    } else {
      setCategories([...categories, category]);
    }
  };

  async function saveHotel(ev) {
    ev.preventDefault();
    const data = {
      title,
      description,
      descriptionSmall,
      images,
      categories,
      availableRooms,
      address,
      phone,
      website,
      workingHours,
      facebook,
      instagram,
      tripAdvisor,
    };
    if (_id) {
      //update
      await axios.put('/api/hotels', { ...data, _id });
    } else {
      //create
      await axios.post('/api/hotels', data);
    }
    setGoToHotels(true);
  }


  if (goToHotels) {
    router.push('/hotels');
  }


  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      const res = await axios.post('/api/upload', data);
      setImages(oldImages => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
    }
  }

  function confirmDeleteImage(link) {
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
        deleteImage(link); // Call the delete function if confirmed
      }
    });
  }

  // Function to delete image
  async function deleteImage(link) {
    const key = link.split('/').pop(); // Extracting the filename from the link
    await axios.post('/api/delete', { key });
    setImages(oldImages => oldImages.filter(image => image !== link)); // Remove from state
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  return (
    <form onSubmit={saveHotel}>
      <label>სახელი</label>
      <input
        type="text"
        placeholder="სასტუმროს სახელი"
        value={title}
        onChange={ev => setTitle(ev.target.value)} />

      <label className="my-3 inline-block">კატეგორიები</label>
      <div className="grid grid-cols-4 gap-2 p-3 shadow-lg max-h-32 overflow-auto mb-5">
        {fetchedCategories.map((category) => (

          <div key={category._id}>
            <label className="flex items-center gap-1 text-base">
              {category.name}
              <input
                className="w-auto p-0 m-0"
                type="checkbox"
                value={category._id}
                defaultChecked={categories.find((cat) => cat._id === category._id)}
                onChange={(ev) => handleCategoryChange(category._id)}
              />
            </label>
          </div>
        ))}
      </div>

      <label>
        ფოტოები
      </label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          list={images}
          className="flex flex-wrap gap-1"
          setList={updateImagesOrder}>
          {!!images?.length && images.map(link => (
            <div key={link} className="h-44 bg-white p-4 shadow-sm rounded-sm border border-gray-200 relative">
              <img src={link} alt="" className="rounded-lg w-auto" />
              {/* Delete button */}
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 cursor-pointer"
                onClick={() => confirmDeleteImage(link)}>
                X
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
          <div>
            სურათის დამატება
          </div>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
      </div>

      <label>სრული აღწერა</label>
      <textarea
        placeholder="სრული აღწერა"
        value={description}
        onChange={ev => setDescription(ev.target.value)}
      />

      <label>მოკლე აღწერა</label>
      <textarea
        placeholder="მოკლე აღწერა"
        value={descriptionSmall}
        onChange={ev => setDescriptionSmall(ev.target.value)}
      />


      <label>ოთახების რაოდენობა</label>
      <input
        type="number" placeholder="ოთახების რაოდენობა"
        value={availableRooms}
        onChange={ev => setAvailableRooms(ev.target.value)}
      />

      <label>მისამართი</label>
      <input
        type="text" placeholder="მისამართი"
        value={address}
        onChange={ev => setAddress(ev.target.value)}
      />


      <label>ტელეფონი</label>
      <input
        type="text" placeholder="ტელეფონი"
        value={phone}
        onChange={ev => setPhone(ev.target.value)}
      />

      <label>ვებსაიტი</label>
      <input
        type="text" placeholder="ვებსაიტი"
        value={website}
        onChange={ev => setWebsite(ev.target.value)}
      />

      <label>სამუშაო საათები</label>
      <input
        type="text" placeholder="სამუშაო საათები"
        value={workingHours}
        onChange={ev => setWorkingHours(ev.target.value)}
      />

      <label>Facebook</label>
      <input
        type="text" placeholder="ფეისბუქის ლინკი"
        value={facebook}
        onChange={ev => setFacebook(ev.target.value)}
      />

      <label>Instagram</label>
      <input
        type="text" placeholder="ინსტაგრამის ლინკი"
        value={instagram}
        onChange={ev => setInstagram(ev.target.value)}
      />

      <label>Trip Advisor</label>
      <input
        type="text" placeholder="თრიფ ედვაისორის ლინკი"
        value={tripAdvisor}
        onChange={ev => setTripAdvisor(ev.target.value)}
      />



      <button
        type="submit"
        className="btn-primary">
        დამახსოვრება
      </button>
    </form>
  );
}

export default withSwal(({ swal, ...hotelInfo }, ref) => (
  <HotelForm swal={swal} {...hotelInfo} />
));