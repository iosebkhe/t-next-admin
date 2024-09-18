import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';

function Languages({ swal }) {
  const [editedLanguage, setEditedLanguage] = useState(null);
  const [name, setName] = useState('');
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    fetchLanguages();
  }, []);

  function fetchLanguages() {
    axios.get('/api/languages').then(result => {
      setLanguages(result.data);
    });
  }

  async function saveLanguage(ev) {
    ev.preventDefault();
    const data = {
      name,
    };

    if (editedLanguage) {
      data._id = editedLanguage._id;
      await axios.put('/api/languages', data);
      setEditedLanguage(null);
    } else {
      await axios.post('/api/languages', data);
    }
    setName('');
    fetchLanguages();
  }

  function editLanguage(language) {
    setEditedLanguage(language);
    setName(language.name);
  }

  function deleteLanguage(language) {
    swal.fire({
      title: 'ნამდვილად გსურთ ენის წაშლა?',
      text: `გინდათ წაშალოთ: ${language.name}?`,
      showCancelButton: true,
      cancelButtonText: 'დახურვა',
      confirmButtonText: 'წაშლა',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        const { _id } = language;
        await axios.delete('/api/languages?_id=' + _id);
        fetchLanguages();
      }
    });
  }

  return (
    <Layout>
      <h1>ენები</h1>
      <label>
        {editedLanguage
          ? `${editedLanguage.name} - რედაქტირება`
          : 'ახალი ენის დამატება'}
      </label>

      <form onSubmit={saveLanguage}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={'ენის სახელი'}
            onChange={ev => setName(ev.target.value)}
            value={name} />
        </div>

        <div className="flex gap-1">
          {editedLanguage && (
            <button
              type="button"
              onClick={() => {
                setEditedLanguage(null);
                setName('');
              }}
              className="btn-default">დაბრუნება</button>
          )}

          <button type="submit"
            className="btn-primary py-1">
            ენის დამახსოვრება
          </button>
        </div>

      </form>

      {!editedLanguage && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>ენები</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {languages.length > 0 && languages.map(language => (
              <tr key={language._id}>
                <td>{language.name}</td>
                <td>
                  <button
                    onClick={() => editLanguage(language)}
                    className="btn-default mr-1"
                  >
                    რედაქტირება
                  </button>
                  <button
                    onClick={() => deleteLanguage(language)}
                    className="btn-red">წაშლა</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => (
  <Languages swal={swal} />
));
