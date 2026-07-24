export function healthQuery() {
	return `{
  "summary": {
    "totalVirtualTourItems": count(*[_type == "virtualTourItem"]),
    "withoutLinks": count(*[_type == "virtualTourItem" && (!defined(links) || count(links) == 0)]),
    "withoutImages": count(*[_type == "virtualTourItem" && !defined(image.asset._ref)]),
    "withBrokenImageAssetReference": count(*[_type == "virtualTourItem" && defined(image.asset._ref) && !defined(image.asset->_id)]),
    "withLinksMissingNodeReference": count(*[_type == "virtualTourItem" && count(links[!defined(nodeID._ref)]) > 0]),
    "withBrokenLinkReferences": count(*[_type == "virtualTourItem" && count(links[defined(nodeID._ref) && !defined(nodeID->_id)]) > 0]),
    "withMissingTextureCoordinates": count(*[_type == "virtualTourItem" && count(links[!defined(textureX) || !defined(textureY)]) > 0]),
    "withSelfLinks": count(*[_type == "virtualTourItem" && count(links[nodeID._ref == ^._id]) > 0]),
    "missingTitle": count(*[_type == "virtualTourItem" && !defined(title)]),
    "missingCaption": count(*[_type == "virtualTourItem" && !defined(caption)])
  },
  "noImageNodes": *[_type == "virtualTourItem" && !defined(image.asset._ref)] | order(caption asc) {
    _id, title, caption, "linkCount": count(links)
  },
  "brokenImages": *[_type == "virtualTourItem" && defined(image.asset._ref) && !defined(image.asset->_id)] | order(caption asc) {
    _id, title, caption, "imageAssetRef": image.asset._ref
  },
  "brokenLinks": *[_type == "virtualTourItem" && count(links[!defined(nodeID._ref) || !defined(nodeID->_id)]) > 0] | order(caption asc) {
    _id, title, caption,
    "badLinks": links[!defined(nodeID._ref) || !defined(nodeID->_id)] {
      _key, textureX, textureY, "targetRef": nodeID._ref, "targetExists": defined(nodeID->_id)
    }
  },
  "noLinkNodes": *[_type == "virtualTourItem" && (!defined(links) || count(links) == 0)] | order(caption asc) {
    _id, title, caption, "imageRef": image.asset._ref
  },
  "missingMetadata": *[_type == "virtualTourItem" && (!defined(title) || !defined(caption) || !defined(poseHeading) || !defined(posePitch))] | order(caption asc) {
    _id, title, caption, poseHeading, posePitch
  },
  "missingTextures": *[_type == "virtualTourItem" && count(links[!defined(textureX) || !defined(textureY)]) > 0] | order(caption asc) {
    _id, title, caption,
    "problemLinks": links[!defined(textureX) || !defined(textureY)] {
      _key, "targetRef": nodeID._ref, textureX, textureY
    }
  },
  "selfLinks": *[_type == "virtualTourItem" && count(links[nodeID._ref == ^._id]) > 0] | order(caption asc) {
    _id, title, caption,
    "selfLinks": links[nodeID._ref == ^._id] { _key, textureX, textureY, "targetRef": nodeID._ref }
  },
  "attentionDocs": *[
    _type == "virtualTourItem" &&
    (
      !defined(title) || !defined(caption) || !defined(image.asset._ref) || !defined(image.asset->_id) ||
      !defined(links) || count(links) == 0 ||
      count(links[!defined(nodeID._ref) || !defined(nodeID->_id)]) > 0 ||
      count(links[!defined(textureX) || !defined(textureY)]) > 0
    )
  ] | order(caption asc) {
    _id, title, caption,
    "hasImage": defined(image.asset._ref),
    "imageAssetExists": defined(image.asset->_id),
    "linkCount": count(links),
    "badReferenceCount": count(links[!defined(nodeID._ref) || !defined(nodeID->_id)])
  }
}`;
}

export function virtualTourPageBlocks() {
	return `*[_type == "virtualTourPageBlocks"]{
    title,
    description,
    "loader": loader.asset->url,
    start->{ "name": title, "id": _id },
    "defaultZoomLvl": coalesce(defaultZoomLvl, 50),
    "minFov": coalesce(minFov, 30),
    "maxFov": coalesce(maxFov, 90),
    "showGalleryOnLoad": coalesce(showGalleryOnLoad, false),
    "transitionSpeed": coalesce(transitionSpeed, "20rpm"),
    "autorotateEnabled": coalesce(autorotateEnabled, true),
    "autorotateDelay": coalesce(autorotateDelay, 3000),
    "autorotateSpeed": coalesce(autorotateSpeed, "2rpm")
  }`;
}

export function virtualTourItem() {
	return `*[_type == "virtualTourItem"]{
		    "id":_id,
		    "name": title,
		    caption,
		    "panorama":image.asset->url,
		    "thumbnail":image.asset->url + "?w=200",
		    description,
		    "showInGallery": coalesce(showInGallery, true),
		    "links": links[]{
		      "position":{
		        textureX,
		        textureY
		      },
		      "nodeId":nodeID->_id,
		      "name": linkName,
		      "data": {
		        "arrivalPitch": arrivalPitch,
		        "arrivalZoom": arrivalZoom
		      }
		    },
		    "panoData": {poseHeading, posePitch}
		  }`;
}
