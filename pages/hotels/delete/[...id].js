import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DeleteHotelPage() {
  const router = useRouter();
  const [hotelInfo, setHotelInfo] = useState();
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/hotels?id=' + id).then(response => {
      setHotelInfo(response.data);
    });
  }, [id]);

  function goBack() {
    router.push('/hotels');
  }

  async function deleteHotel() {
    await axios.delete('/api/hotels?id=' + id);
    goBack();
  }

  return (
    <Layout>
      <h1 className="text-center">გსურთ წაშალოთ
        &nbsp;&quot;{hotelInfo?.title}&quot;?
      </h1>
      <div className="flex gap-2 justify-center">
        <button
          onClick={deleteHotel}
          className="btn-red">დიახ</button>
        <button
          className="btn-default"
          onClick={goBack}>
          არა
        </button>
      </div>
    </Layout>
  );
}
