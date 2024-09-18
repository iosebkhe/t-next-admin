import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import StoryForm from "@/components/StoryForm";

export default function EditStoryPage() {
  const [storyInfo, setStoryInfo] = useState(null);
  const router = useRouter();

  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }

    axios.get('/api/stories?id=' + id).then(response => {
      setStoryInfo(response.data);
    });
  }, [id]);

  return (
    <Layout>
      <h1>რედაქტირება</h1>
      {storyInfo && (
        <StoryForm {...storyInfo} />
      )}
    </Layout>
  );
}