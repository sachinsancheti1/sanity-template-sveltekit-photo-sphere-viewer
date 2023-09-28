export function virtualTourPageBlocks() {
  return `*[_type == "virtualTourPageBlocks"]{
    title,
    description,
    "loader":loader.asset->url,
    start->{
    "name": title,
    "id":_id
    }
  }`
}

export function virtualTourItem(){
	return `*[_type == "virtualTourItem"]{
		    "id":_id,
		    "name": title,
		    caption,
		    "panorama":image.asset->url,
		    "thumbnail":image.asset->url + "?w=200",
		    "links": links[]{
		      "position":{
		        textureX,
		        textureY
		      },
		      "nodeId":nodeID->_id
		    },
		    "panoData": {poseHeading}
		  }`
		}