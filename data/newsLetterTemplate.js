/** @param {{title: string, author: {id: number, name: string}, content: string, img: string, date: string, unsubscribeKey: string}} */
function newsLetterTemplate({ title, author, content, img, date, unsubscribeKey }) {
	return `<!DOCTYPE html>
<html
	xmlns:v="urn:schemas-microsoft-com:vml"
	xmlns:o="urn:schemas-microsoft-com:office:office"
	lang="en"
>
	<head>
		<title>ECOLY - News Letter</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="viewport" content="width=device-width,initial-scale=1" />
		<!--[if mso
			]><xml
				><o:OfficeDocumentSettings
					><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG /></o:OfficeDocumentSettings></xml
		><![endif]-->
		<!--[if !mso]><!-->
		<link
			href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&amp;display=swap"
			rel="stylesheet"
			type="text/css"
		/>
		<!--<![endif]-->
		<style>
			* {
				box-sizing: border-box;
			}
			body {
				margin: 0;
				padding: 0;
			}
			a[x-apple-data-detectors] {
				color: inherit !important;
				text-decoration: inherit !important;
			}
			#MessageViewBody a {
				color: inherit;
				text-decoration: none;
			}
			p {
				line-height: inherit;
			}
			.desktop_hide,
			.desktop_hide table {
				mso-hide: all;
				display: none;
				max-height: 0;
				overflow: hidden;
			}
			.image_block img + div {
				display: none;
			}
			@media (max-width: 620px) {
				.fullMobileWidth,
				.row-content {
					width: 100% !important;
				}
				.mobile_hide {
					display: none;
				}
				.stack .column {
					width: 100%;
					display: block;
				}
				.mobile_hide {
					min-height: 0;
					max-height: 0;
					max-width: 0;
					overflow: hidden;
					font-size: 0;
				}
				.desktop_hide,
				.desktop_hide table {
					display: table !important;
					max-height: none !important;
				}
			}
		</style>
	</head>
	<body
		style="
			background-color: #fff;
			margin: 0;
			padding: 0;
			-webkit-text-size-adjust: none;
			text-size-adjust: none;
		"
	>
		<table
			class="nl-container"
			width="100%"
			border="0"
			cellpadding="0"
			cellspacing="0"
			role="presentation"
			style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #fff"
		>
			<tbody>
				<tr>
					<td>
						<table
							class="row row-1"
							align="center"
							width="100%"
							border="0"
							cellpadding="0"
							cellspacing="0"
							role="presentation"
							style="mso-table-lspace: 0; mso-table-rspace: 0"
						>
							<tbody>
								<tr>
									<td>
										<table
											class="row-content stack"
											align="center"
											border="0"
											cellpadding="0"
											cellspacing="0"
											role="presentation"
											style="
												mso-table-lspace: 0;
												mso-table-rspace: 0;
												background-color: #343e3d;
												color: #000;
												width: 600px;
											"
											width="600"
										>
											<tbody>
												<tr>
													<td
														class="column column-1"
														width="100%"
														style="
															mso-table-lspace: 0;
															mso-table-rspace: 0;
															font-weight: 400;
															text-align: left;
															padding-bottom: 15px;
															padding-top: 15px;
															vertical-align: top;
															border-top: 0;
															border-right: 0;
															border-bottom: 0;
															border-left: 0;
														"
													>
														<table
															class="text_block block-1"
															width="100%"
															border="0"
															cellpadding="10"
															cellspacing="0"
															role="presentation"
															style="
																mso-table-lspace: 0;
																mso-table-rspace: 0;
																word-break: break-word;
															"
														>
															<tr>
																<td class="pad">
																	<div style="font-family: Arial, sans-serif">
																		<div
																			class
																			style="
																				font-size: 12px;
																				font-family: 'Open Sans',
																					'Helvetica Neue', Helvetica, Arial,
																					sans-serif;
																				mso-line-height-alt: 14.399999999999999px;
																				color: #e4f0e8;
																				line-height: 1.2;
																			"
																		>
																			<p
																				style="
																					margin: 0;
																					font-size: 12px;
																					text-align: center;
																					mso-line-height-alt: 14.399999999999999px;
																				"
																			>
																				<span style="font-size: 26px"
																					><strong>ECOLY - News Letter</strong
																					><br
																				/></span>
																			</p>
																		</div>
																	</div>
																</td>
															</tr>
														</table>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
							</tbody>
						</table>
						<table
							class="row row-2"
							align="center"
							width="100%"
							border="0"
							cellpadding="0"
							cellspacing="0"
							role="presentation"
							style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #fff"
						>
							<tbody>
								<tr>
									<td>
										<table
											class="row-content stack"
											align="center"
											border="0"
											cellpadding="0"
											cellspacing="0"
											role="presentation"
											style="
												mso-table-lspace: 0;
												mso-table-rspace: 0;
												background-color: #e4f0e8;
												color: #000;
												width: 600px;
											"
											width="600"
										>
											<tbody>
												<tr>
													<td
														class="column column-1"
														width="100%"
														style="
															mso-table-lspace: 0;
															mso-table-rspace: 0;
															font-weight: 400;
															text-align: left;
															padding-bottom: 15px;
															padding-top: 15px;
															vertical-align: top;
															border-top: 0;
															border-right: 0;
															border-bottom: 0;
															border-left: 0;
														"
													>
														<table
															class="image_block block-1"
															width="100%"
															border="0"
															cellpadding="0"
															cellspacing="0"
															role="presentation"
															style="mso-table-lspace: 0; mso-table-rspace: 0"
														>
															<tr>
																<td
																	class="pad"
																	style="
																		width: 100%;
																		padding-right: 0;
																		padding-left: 0;
																	"
																>
																	<div
																		class="alignment"
																		align="center"
																		style="line-height: 10px"
																	>
																		<img
																			class="fullMobileWidth"
																			src="${img}"
																			style="
																				display: block;
																				height: auto;
																				border: 0;
																				width: 420px;
																				max-width: 100%;
																			"
																			width="420"
																			alt="Alternate text"
																			title="Alternate text"
																		/>
																	</div>
																</td>
															</tr>
														</table>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
							</tbody>
						</table>
						<table
							class="row row-3"
							align="center"
							width="100%"
							border="0"
							cellpadding="0"
							cellspacing="0"
							role="presentation"
							style="mso-table-lspace: 0; mso-table-rspace: 0"
						>
							<tbody>
								<tr>
									<td>
										<table
											class="row-content stack"
											align="center"
											border="0"
											cellpadding="0"
											cellspacing="0"
											role="presentation"
											style="
												mso-table-lspace: 0;
												mso-table-rspace: 0;
												background-color: #e4f0e8;
												color: #000;
												width: 600px;
											"
											width="600"
										>
											<tbody>
												<tr>
													<td
														class="column column-1"
														width="100%"
														style="
															mso-table-lspace: 0;
															mso-table-rspace: 0;
															font-weight: 400;
															text-align: left;
															padding-bottom: 15px;
															padding-left: 20px;
															padding-right: 20px;
															padding-top: 15px;
															vertical-align: top;
															border-top: 0;
															border-right: 0;
															border-bottom: 0;
															border-left: 0;
														"
													>
														<table
															class="text_block block-1"
															width="100%"
															border="0"
															cellpadding="10"
															cellspacing="0"
															role="presentation"
															style="
																mso-table-lspace: 0;
																mso-table-rspace: 0;
																word-break: break-word;
															"
														>
															<tr>
																<td class="pad">
																	<div style="font-family: sans-serif">
																		<div
																			class
																			style="
																				font-size: 12px;
																				font-family: Arial, Helvetica Neue,
																					Helvetica, sans-serif;
																				mso-line-height-alt: 14.399999999999999px;
																				color: #343434;
																				line-height: 1.2;
																			"
																		>
																			<p
																				style="
																					margin: 0;
																					text-align: center;
																					mso-line-height-alt: 14.399999999999999px;
																				"
																			>
																				<strong
																					><span style="font-size: 20px"
																						>${title}<br /></span
																				></strong>
																			</p>
																		</div>
																	</div>
																</td>
															</tr>
														</table>
														<table
															class="text_block block-2"
															width="100%"
															border="0"
															cellpadding="10"
															cellspacing="0"
															role="presentation"
															style="
																mso-table-lspace: 0;
																mso-table-rspace: 0;
																word-break: break-word;
															"
														>
															<tr>
																<td class="pad">
																	<div style="font-family: sans-serif">
																		<div
																			class
																			style="
																				font-size: 12px;
																				font-family: Arial, Helvetica Neue,
																					Helvetica, sans-serif;
																				mso-line-height-alt: 14.399999999999999px;
																				color: #343434;
																				line-height: 1.2;
																			"
																		>
																			<p
																				style="
																					margin: 0;
																					text-align: justify;
																					mso-line-height-alt: 14.399999999999999px;
																				"
																			>
																				<span style="font-size: 14px"
																					>${content}</span
																				>
																			</p>
																			<p
																				style="
																					margin: 0;
																					mso-line-height-alt: 14.399999999999999px;
																				"
																			>
																				&nbsp;
																			</p>
																		</div>
																	</div>
																</td>
															</tr>
														</table>
														<table
															class="divider_block block-3"
															width="100%"
															border="0"
															cellpadding="10"
															cellspacing="0"
															role="presentation"
															style="mso-table-lspace: 0; mso-table-rspace: 0"
														>
															<tr>
																<td class="pad">
																	<div class="alignment" align="center">
																		<table
																			border="0"
																			cellpadding="0"
																			cellspacing="0"
																			role="presentation"
																			width="100%"
																			style="
																				mso-table-lspace: 0;
																				mso-table-rspace: 0;
																			"
																		>
																			<tr>
																				<td
																					class="divider_inner"
																					style="
																						font-size: 1px;
																						line-height: 1px;
																						border-top: 1px solid #343e3d;
																					"
																				>
																					<span>&#8202;</span>
																				</td>
																			</tr>
																		</table>
																	</div>
																</td>
															</tr>
														</table>
														<table
															class="text_block block-4"
															width="100%"
															border="0"
															cellpadding="10"
															cellspacing="0"
															role="presentation"
															style="
																mso-table-lspace: 0;
																mso-table-rspace: 0;
																word-break: break-word;
															"
														>
															<tr>
																<td class="pad">
																	<div style="font-family: sans-serif">
																		<div
																			class
																			style="
																				font-size: 14px;
																				font-family: Arial, Helvetica Neue,
																					Helvetica, sans-serif;
																				mso-line-height-alt: 16.8px;
																				color: #343434;
																				line-height: 1.2;
																			"
																		>
																			<p
																				style="
																					margin: 0;
																					font-size: 14px;
																					text-align: center;
																					mso-line-height-alt: 16.8px;
																				"
																			>
																				Esta notícia foi criada por <a href="https://ecoly-2023.netlify.app/account/${author.id}" style="color: #18516f; text-decoration: none" target="_blank">${author.name}</a>
																				em ${date}
																			</p>
																		</div>
																	</div>
																</td>
															</tr>
														</table>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
							</tbody>
						</table>
						<table
							class="row row-4"
							align="center"
							width="100%"
							border="0"
							cellpadding="0"
							cellspacing="0"
							role="presentation"
							style="mso-table-lspace: 0; mso-table-rspace: 0"
						>
							<tbody>
								<tr>
									<td>
										<table
											class="row-content stack"
											align="center"
											border="0"
											cellpadding="0"
											cellspacing="0"
											role="presentation"
											style="
												mso-table-lspace: 0;
												mso-table-rspace: 0;
												background-color: #e4f0e8;
												color: #000;
												width: 600px;
											"
											width="600"
										>
											<tbody>
												<tr>
													<td
														class="column column-1"
														width="100%"
														style="
															mso-table-lspace: 0;
															mso-table-rspace: 0;
															font-weight: 400;
															text-align: left;
															padding-bottom: 5px;
															padding-top: 5px;
															vertical-align: top;
															border-top: 0;
															border-right: 0;
															border-bottom: 0;
															border-left: 0;
														"
													>
														<table
															class="text_block block-1"
															width="100%"
															border="0"
															cellpadding="10"
															cellspacing="0"
															role="presentation"
															style="
																mso-table-lspace: 0;
																mso-table-rspace: 0;
																word-break: break-word;
															"
														>
															<tr>
																<td class="pad">
																	<div style="font-family: sans-serif">
																		<div
																			class
																			style="
																				font-size: 12px;
																				font-family: Arial, Helvetica Neue,
																					Helvetica, sans-serif;
																				mso-line-height-alt: 14.399999999999999px;
																				color: #555;
																				line-height: 1.2;
																			"
																		>
																			<p
																				style="
																					margin: 0;
																					text-align: center;
																					mso-line-height-alt: 14.399999999999999px;
																				"
																			>
																				<strong
																					>Não queres receber mais
																					emails?</strong
																				>
																				Cancela a tua subscrição da News Letter
																			</p>
																			<p
																				style="
																					margin: 0;
																					text-align: center;
																					mso-line-height-alt: 14.399999999999999px;
																				"
																			>
																				&nbsp;<a href="https://ecoly-2023.netlify.app/unsubscribe/${unsubscribeKey}" style="color: #18516f; text-decoration: underline" target="_blank">https://ecoly-2023.netlify.app/unsubscribe/${unsubscribeKey}</a>
																			</p>
																		</div>
																	</div>
																</td>
															</tr>
														</table>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
							</tbody>
						</table>
						<table
							class="row row-5"
							align="center"
							width="100%"
							border="0"
							cellpadding="0"
							cellspacing="0"
							role="presentation"
							style="mso-table-lspace: 0; mso-table-rspace: 0"
						>
							<tbody>
								<tr>
									<td>
										<table
											class="row-content stack"
											align="center"
											border="0"
											cellpadding="0"
											cellspacing="0"
											role="presentation"
											style="
												mso-table-lspace: 0;
												mso-table-rspace: 0;
												background-color: #343e3d;
												color: #000;
												width: 600px;
											"
											width="600"
										>
											<tbody>
												<tr>
													<td
														class="column column-1"
														width="100%"
														style="
															mso-table-lspace: 0;
															mso-table-rspace: 0;
															font-weight: 400;
															text-align: left;
															padding-bottom: 15px;
															padding-top: 15px;
															vertical-align: top;
															border-top: 0;
															border-right: 0;
															border-bottom: 0;
															border-left: 0;
														"
													>
														<table
															class="text_block block-1"
															width="100%"
															border="0"
															cellpadding="10"
															cellspacing="0"
															role="presentation"
															style="
																mso-table-lspace: 0;
																mso-table-rspace: 0;
																word-break: break-word;
															"
														>
															<tr>
																<td class="pad">
																	<div style="font-family: Arial, sans-serif">
																		<div
																			class
																			style="
																				font-size: 12px;
																				font-family: 'Open Sans',
																					'Helvetica Neue', Helvetica, Arial,
																					sans-serif;
																				mso-line-height-alt: 14.399999999999999px;
																				color: #e4f0e8;
																				line-height: 1.2;
																			"
																		>
																			<p
																				style="
																					margin: 0;
																					font-size: 12px;
																					text-align: center;
																					mso-line-height-alt: 14.399999999999999px;
																				"
																			>
																				<span style="font-size: 10px"
																					>© Ecoly | All Rights Reserved</span
																				>
																			</p>
																		</div>
																	</div>
																</td>
															</tr>
														</table>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
			</tbody>
		</table>
		<!-- End -->
	</body>
</html>
`;
}

module.exports = newsLetterTemplate;
