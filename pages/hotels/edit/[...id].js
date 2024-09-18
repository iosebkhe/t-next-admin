import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import HotelForm from "@/components/HotelForm";

export default function EditHotelPage() {
  const [hotelInfo, setHotelInfo] = useState(null);
  const router = useRouter();

  const { id } = router.query;
  console.log(id);

  useEffect(() => {
    if (!id) {
      return;
    }

    axios.get('/api/hotels?id=' + id).then(response => {
      setHotelInfo(response.data);
    });
  }, [id]);

  return (
    <Layout>
      <h1>რედაქტირება</h1>
      {hotelInfo && (
        <HotelForm {...hotelInfo} />
      )}
    </Layout>
  );
}