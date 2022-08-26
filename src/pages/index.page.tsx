import Loading from "../components/public.components/loading.component";
import useRedirect from "../hooks/redirects/useRedirect";

const IndexPage = () => {
  useRedirect();

  return (
    <>
    <Loading/>
    </>
  )
}

export default IndexPage;