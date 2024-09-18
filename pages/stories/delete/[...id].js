import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DeleteStoryPage() {
  const router = useRouter();
  const [storyInfo, setStoryInfo] = useState();
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/stories?id=' + id).then(response => {
      setStoryInfo(response.data);
    });
  }, [id]);

  function goBack() {
    router.push('/stories');
  }

  async function deleteStory() {
    await axios.delete('/api/stories?id=' + id);
    goBack();
  }

  return (
    <Layout>
      <h1 className="text-center">გსურთ წაშალოთ
        &nbsp;&quot;{storyInfo?.title}&quot;?
      </h1>
      <div className="flex gap-2 justify-center">
        <button
          onClick={deleteStory}
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
