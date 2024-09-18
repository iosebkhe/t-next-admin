import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import GuideForm from "@/components/GuideForm";

export default function EditGuidePage() {
  const [guideInfo, setGuideInfo] = useState(null);
  const router = useRouter();

  const { id } = router.query;
  
  useEffect(() => {
    if (!id) {
      return;
    }

    axios.get('/api/guides?id=' + id).then(response => {
      setGuideInfo(response.data);
    });
  }, [id]);

  return (
    <Layout>
      <h1>რედაქტირება</h1>
      {guideInfo && (
        <GuideForm {...guideInfo} />
      )}
    </Layout>
  );
}