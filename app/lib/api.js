import {
  getDescriptor,
  parseDescriptor,
  getNavTree,
  urlTransform
} from '@craftercms/content';
import { firstValueFrom, map, switchMap } from 'rxjs';

export async function getModel(path = "/site/website/index.xml") {
  return await firstValueFrom(
    getDescriptor(path, { flatten: true }).pipe(
      map((descriptor) => parseDescriptor(descriptor, { parseFieldValueTypes: true }))
      // Can use this for debugging purposes.
      // tap(console.log)
    )
  );
}

export async function getModelByUrl(webUrl = '/') {
  console.log("webUrl", webUrl);
  return await firstValueFrom(
    urlTransform('renderUrlToStoreUrl', webUrl).pipe(
      switchMap((path) => getDescriptor(path, { flatten: true }).pipe(
        map((descriptor) => parseDescriptor(descriptor, { parseFieldValueTypes: true }))
      ))
    )
  );
}

export async function getInitialProps(context) {
  const composedPath = context.params?.id?.join('/') ?? context.pathname;
  // const composedPath = context.asPath;
  // console.log(context.params?.id?.join('/'))
  console.log(composedPath);
  const model = await getModelByUrl(composedPath);
  return { model };
}

export async function getModelById(id) {
  // const composedPath = context.asPath;
  // console.log(context.params?.id?.join('/'))
  let composedPath;
  if (id instanceof Array) {
    composedPath = id.join('/');
  } else {
    composedPath = id ?? '/';
  }
  console.log("composedPath", composedPath);
  const model = await getModelByUrl(composedPath);
  return { model };
}

export async function getNav() {
  return await firstValueFrom(
    getNavTree("/site/website", 1).pipe(
      // Flatten the nav so that home shows at the same level as the children.
      map((navigation) => [
        {
          label: navigation.label,
          url: navigation.url,
          active: navigation.active,
          attributes: navigation.attributes
        },
        ...navigation.subItems,
      ])
    )
  );
}


export async function loadPages() {
  // Call an external API endpoint to get posts
  const CMS_API = `${process.env.NEXT_PUBLIC_CRAFTERCMS_HOST_NAME}/api/1/services/page.json?path=/site/website&depth=3&crafterSite=${process.env.NEXT_PUBLIC_CRAFTERCMS_SITE_NAME}`;

  console.log("CMS URL >>>>>>>", CMS_API);
  const res = await fetch(CMS_API);
  console.log("res status", res.status);
  const data = await res.json();
  console.log("data >>>>>>>", data);

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
  return paths;
}