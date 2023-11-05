import React from 'react';
import { getInitialProps } from '../lib/api';
import { contentTypeMap, useCrafterAppContext } from './_app';
import Typography from '@mui/material/Typography';
import {
  ExperienceBuilder,
  RenderComponents,
  RenderField
} from '@craftercms/experience-builder/react';
import Footer from '../components/Footer';

export async function getStaticPaths() {
  if (process.env.SKIP_BUILD_STATIC_GENERATION) {
    return {
      paths: [],
      fallback: 'blocking',
    }
  }
  /**
   * use server script to get all items from root
   */
  const CMS_API = `${process.env.NEXT_PUBLIC_CRAFTERCMS_HOST_NAME}/api/1/services/page.json?path=/site/website&depth=3&crafterSite=${process.env.NEXT_PUBLIC_CRAFTERCMS_SITE_NAME}`;
  console.log("CMS URL >>>>>>>", CMS_API);
  const res = await fetch(CMS_API);
  const data = await res.json();
  console.log("data >>>>>>>", data);
  /**
   * work out all item of content-page: /page/*
   * remap item url as array and exlcuding "site" & "website"
  */
  const paths = data.childItems
    ?.filter((item) => item?.dom?.page?.["content-type"]?.indexOf("/page/") !== -1)
    ?.map((item) => {
      const segments = item.url
        ?.split('/')
        ?.filter((segment) => segment !== "site" && segment !== "website");
      console.log("segments >>>>>>>", segments);
      return {
        params: {
          id: segments,
        }
      }
    });

  // const paths = [
  //   { params: { id: ['test'] } }
  // ];

  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps(context) {
  const { model } = await getInitialProps(context);
  console.log("MODEL >>>>>>>", model);
  return {
    props: {
      params: context.params,
      model,
    },
    revalidate: 10 * 60 * 10, // In seconds
  }
}

// export async function getServerSideProps(context) {
//   const data = await getInitialProps(context);
//   return { props: data };
// }

export default function WildCardPage({ model }) {
  console.log(">>>>>>> MODEL >>>>>>>", model);
  const { isAuthoring } = useCrafterAppContext();
  if (!model) {
    return <div>No model found</div>
  }
  return (
    <>
      {JSON.stringify(model)}
      <ExperienceBuilder model={model} isAuthoring={isAuthoring}>
        <div>
          {JSON.stringify(model)}
        </div>
        <RenderField
          model={model}
          fieldId="title_s"
          component={Typography}
          variant="title"
          componentProps={{
            // Component props can simply be sent as props to RenderField, and
            // they would be passed down to Typography, however, because there's
            // a prop name collision (i.e. `component`) we can use componentProps
            // to supply the component prop directly to Typography.
            component: 'h1'
          }}
          align="center"
          sx={{ m: 1 }}
        />
        <RenderComponents contentTypeMap={contentTypeMap} model={model} fieldId="content_o" />
        <Footer />
      </ExperienceBuilder>
    </>
  );
}

// WildCardPage.getInitialProps = getInitialProps;
