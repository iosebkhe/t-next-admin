/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { withSwal } from "react-sweetalert2";
import { ReactSortable } from "react-sortablejs";

function GuideForm({ swal,
  _id,
  fullName: existingFullName,
  email: existingEmail,
  biography: existingBiography,
  languages: existingLanguages,
  images: existingImages,
  categories: existingCategories,
  phone: existingPhone,
  isCertified: existingIsCertified,
  certifications: existingCertifications,
}) {
  const [fullName, setFullName] = useState(existingFullName || '');
  const [email, setEmail] = useState(existingEmail || '');
  const [biography, setBiography] = useState(existingBiography || '');
  const [languages, setLanguages] = useState(() => {
    if (existingLanguages) {
      return existingLanguages;
    } else {
      return [];
    }
  });
  const [images, setImages] = useState(existingImages || []);
  const [categories, setCategories] = useState(() => {
    if (existingCategories) {
      return existingCategories;
    } else {
      return [];
    }
  });
  const [phone, setPhone] = useState(existingPhone || "");
  const [isCertified, setIsCertified] = useState(existingIsCertified || false);
  const [certifications, setCertifications] = useState(existingCertifications || []);

  const [goToGuides, setGoToGuides] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCertificateUploading, setIsCertificateUploading] = useState(false);
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [fetchedLanguages, setFetchedLanguages] = useState([]);

  const router = useRouter();
  console.log(certifications);
  useEffect(() => {
    axios.get('/api/categories').then(result => {
      setFetchedCategories(result.data);
    });
  }, []);

  useEffect(() => {
    axios.get('/api/languages').then(result => {
      setFetchedLanguages(result.data);
    });
  }, []);

  const handleLanguageChange = (languageId) => {
    const language = fetchedLanguages.find((lang) => lang._id === languageId);

    if (!language) {
      console.error('Language not found:', languageId);
      return;
    }

    if (languages.find((lang) => lang._id === languageId)) {
      setLanguages((prevLanguages) =>
        prevLanguages.filter((lang) => lang._id !== languageId)
      );
    } else {
      setLanguages([...languages, language]);
    }
  };


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

  async function saveGuide(ev) {
    ev.preventDefault();
    const data = {
      fullName,
      email,
      biography,
      languages,
      images,
      categories,
      phone,
      isCertified,
      certifications
    };
    if (_id) {
      //update
      await axios.put('/api/guides', { ...data, _id });
    } else {
      //create
      await axios.post('/api/guides', data);
    }
    setGoToGuides(true);
  }


  if (goToGuides) {
    router.push('/guides');
  }

  async function uploadCertificates(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsCertificateUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      const res = await axios.post('/api/upload', data);
      setCertifications(oldCertificates => {
        return [...oldCertificates, ...res.data.links];
      });
      setIsCertificateUploading(false);
    }
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

  function confirmDeleteCertificate(link) {
    swal.fire({
      title: 'ნამდვილად გსურთ სერთიფიკატის წაშლა?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d55',
      cancelButtonText: 'დახურვა',
      confirmButtonText: 'წაშლა',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        deleteCertificate(link); // Call the delete function if confirmed
      }
    });
  }

  // Function to delete image
  async function deleteImage(link) {
    const key = link.split('/').pop(); // Extracting the filename from the link
    await axios.post('/api/delete', { key });
    setImages(oldImages => oldImages.filter(image => image !== link)); // Remove from state
  }

  // Function to delete certificate
  async function deleteCertificate(link) {
    const key = link.split('/').pop(); // Extracting the filename from the link
    await axios.post('/api/delete', { key });
    setCertifications(oldCertificates => oldCertificates.filter(certificate => certificate !== link)); // Remove from state
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  return (
    <form onSubmit={saveGuide}>
      <label>სახელი და გვარი</label>
      <input
        type="text"
        placeholder="გიდის სახელი და გვარი"
        value={fullName}
        onChange={ev => setFullName(ev.target.value)} />

      <label>იმეილი</label>
      <input
        type="text"
        placeholder="გიდის იმეილი"
        value={email}
        onChange={ev => setEmail(ev.target.value)} />

      <label className="my-3 inline-block">კატეგორიები</label>
      <div className="grid grid-cols-4 gap-2 p-3 shadow-lg max-h-44 overflow-auto mb-5">
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
        გიდის ფოტო
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

      <label>გიდის აღწერა</label>
      <textarea
        placeholder="სრული აღწერა"
        value={biography}
        onChange={ev => setBiography(ev.target.value)}
      />

      <label className="my-3 inline-block">ენები (მაქსიმუმ 4)</label>
      <div className="grid grid-cols-4 gap-2 p-3 shadow-lg max-h-32 overflow-auto mb-5">
        {fetchedLanguages.map((language) => (

          <div key={language._id}>
            <label className="flex items-center gap-1 text-base">
              {language.name}
              <input
                className="w-auto p-0 m-0"
                type="checkbox"
                value={language._id}
                defaultChecked={languages.find((lang) => lang._id === language._id)}
                onChange={(ev) => handleLanguageChange(language._id)}
              />
            </label>
          </div>
        ))}
      </div>

      <label>ტელეფონი</label>
      <input
        type="text" placeholder="ტელეფონი"
        value={phone}
        onChange={ev => setPhone(ev.target.value)}
      />

      <label>სერთიფიცირებულია</label>
      <input
        type="checkbox"
        value={isCertified}
        onChange={ev => setIsCertified(ev.target.value)}
      />

      <label>
        სერთიფიკატები (მაქსიმუმ 3)
      </label>
      <div className="mb-2 flex flex-wrap gap-1">
        <div className="flex flex-wrap gap-1">
          {!!certifications?.length && certifications.map((link, index) => (
            <div key={link} className="relative">
              <a download href={link} className="h-44 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
                <svg className="w-5 h-4" viewBox="0 0 100 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100" height="88" rx="14" fill="white" />
                  <path d="M70.777 73.6474L73.7735 68.4592L78.9591 71.4556L75.1235 57.1377L66.9414 59.3295L70.777 73.6474Z" fill="#F54337" />
                  <path d="M63.1059 73.6474L60.1094 68.4592L54.9238 71.4556L58.7594 57.1377L66.9415 59.3295L63.1059 73.6474Z" fill="#F54337" />
                  <path d="M66.9403 60.9411C73.9575 60.9411 79.6461 55.2524 79.6461 48.2352C79.6461 41.2179 73.9575 35.5293 66.9403 35.5293C59.923 35.5293 54.2344 41.2179 54.2344 48.2352C54.2344 55.2524 59.923 60.9411 66.9403 60.9411Z" fill="#FFEB3C" />
                  <path d="M79.6472 21.7646H22.4707V23.8823H79.6472V21.7646Z" fill="#C4C4C4" />
                  <path d="M79.6472 28.1172H22.4707V30.2348H79.6472V28.1172Z" fill="#C4C4C4" />
                  <path d="M50.0001 34.4707H22.4707V36.5884H50.0001V34.4707Z" fill="#C4C4C4" />
                  <path d="M50.0001 40.8232H22.4707V42.9409H50.0001V40.8232Z" fill="#C4C4C4" />
                  <path d="M50.0001 47.1768H22.4707V49.2944H50.0001V47.1768Z" fill="#C4C4C4" />
                </svg>
                <span>{`სერთიფიკატი ${index + 1}`}</span>

                {/* Delete button */}
              </a>
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 cursor-pointer"
                onClick={() => confirmDeleteCertificate(link)}>
                X
              </button>
            </div>
          ))}
        </div>
        {isCertificateUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <div>
            დამატება
          </div>
          <input type="file" onChange={uploadCertificates} className="hidden" />
        </label>
      </div>



      <button
        type="submit"
        className="btn-primary">
        დამახსოვრება
      </button>
    </form>
  );
}

export default withSwal(({ swal, ...guideInfo }, ref) => (
  <GuideForm swal={swal} {...guideInfo} />
));