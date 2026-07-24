/**
 * Types for GROQ query results returned by virtualTourPageBlocks() and virtualTourItem().
 * Regenerate from the studio with: npm run typegen
 */

export type VirtualTourStart = {
	name: string | null
	id: string
}

export type VirtualTourPageBlocks = {
	title: string | null
	description: string | null
	loader: string | null
	start: VirtualTourStart | null
	defaultZoomLvl: number
	minFov: number
	maxFov: number
	showGalleryOnLoad: boolean
	transitionSpeed: string
	autorotateEnabled: boolean
	autorotateDelay: number
	autorotateSpeed: string
}

export type VirtualTourLinkPosition = {
	textureX: number | null
	textureY: number | null
}

export type VirtualTourLink = {
	position: VirtualTourLinkPosition
	nodeId: string | null
	name: string | null
	data: {
		arrivalPitch: number | null
		arrivalZoom: number | null
	} | null
}

export type VirtualTourPanoData = {
	poseHeading: number | null
	posePitch: number | null
}

export type VirtualTourItem = {
	id: string
	name: string | null
	caption: string | null
	description: string | null
	panorama: string | null
	thumbnail: string | null
	showInGallery: boolean
	links: VirtualTourLink[] | null
	panoData: VirtualTourPanoData | null
}

export type VirtualTourData = {
	virtualTourPageBlocks: VirtualTourPageBlocks
	virtualTourItem: VirtualTourItem[]
}

// Health check types — results of the diagnostic GROQ queries

export type HealthSummary = {
	totalVirtualTourItems: number
	withoutLinks: number
	withoutImages: number
	withBrokenImageAssetReference: number
	withLinksMissingNodeReference: number
	withBrokenLinkReferences: number
	withMissingTextureCoordinates: number
	withSelfLinks: number
	missingTitle: number
	missingCaption: number
}

export type AttentionDoc = {
	_id: string
	title: string | null
	caption: string | null
	hasImage: boolean
	imageAssetExists: boolean
	linkCount: number
	badReferenceCount: number
}

export type NoImageItem = {
	_id: string
	title: string | null
	caption: string | null
	linkCount: number
}

export type BrokenImageItem = {
	_id: string
	title: string | null
	caption: string | null
	imageAssetRef: string
}

export type BadLink = {
	_key: string
	textureX: number | null
	textureY: number | null
	targetRef: string | null
	targetExists: boolean
}

export type BrokenLinksItem = {
	_id: string
	title: string | null
	caption: string | null
	badLinks: BadLink[]
}

export type NoLinkItem = {
	_id: string
	title: string | null
	caption: string | null
	imageRef: string | null
}

export type MissingMetadataItem = {
	_id: string
	title: string | null
	caption: string | null
	poseHeading: number | null
	posePitch: number | null
}

export type ProblemLink = {
	_key: string
	targetRef: string | null
	textureX: number | null
	textureY: number | null
}

export type MissingTexturesItem = {
	_id: string
	title: string | null
	caption: string | null
	problemLinks: ProblemLink[]
}

export type SelfLinkEntry = {
	_key: string
	textureX: number | null
	textureY: number | null
	targetRef: string
}

export type SelfLinkItem = {
	_id: string
	title: string | null
	caption: string | null
	selfLinks: SelfLinkEntry[]
}

export type HealthData = {
	summary: HealthSummary
	attentionDocs: AttentionDoc[]
	noImageNodes: NoImageItem[]
	brokenImages: BrokenImageItem[]
	brokenLinks: BrokenLinksItem[]
	noLinkNodes: NoLinkItem[]
	missingMetadata: MissingMetadataItem[]
	missingTextures: MissingTexturesItem[]
	selfLinks: SelfLinkItem[]
}
