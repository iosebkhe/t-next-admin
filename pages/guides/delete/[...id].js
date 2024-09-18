import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DeleteGuidePage() {
  const router = useRouter();
  const [guideInfo, setGuideInfo] = useState();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/guides?id=' + id).then(response => {
      setGuideInfo(response.data);
    });
  }, [id]);

  function goBack() {
    router.push('/guides');
  }

  async function deleteGuide() {
    await axios.delete('/api/guides?id=' + id);
    goBack();
  }

  return (
    <Layout>
      <h1 className="text-center">გსურთ წაშალოთ
        &nbsp;&quot;{guideInfo?.title}&quot;?
      </h1>
      <div className="flex gap-2 justify-center">
        <button
          onClick={deleteGuide}
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
