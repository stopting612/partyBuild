import { CopartnerService } from "../service/CopartnerService";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { checkPassword } from "../utils/hash";
import jwtSimple from "jwt-simple";
import jwt from "../utils/jwt";
import adal from "adal-node";
import fetch from "node-fetch";

// import { alcoholController } from "../main";

export class CopartnerController {
    constructor(private copartnerService: CopartnerService) { }

    copartnerLogin = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Incorrect email or password" });
                return;
            }
            if (typeof email !== "string" || typeof password !== "string") {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Incorrect Type of submit form" });
                return;
            }
            const copartner = await this.copartnerService.copartnerLogin(email);
            if (!copartner) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Incorrect email or password" });
                return;
            }
            const pass = await checkPassword(password, copartner.password);
            if (!pass) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Incorrect email or password" });
                return;
            }
            const payload = {
                id: copartner.id,
                email: copartner.email,
                type: "copartner",
            };
            const token = jwtSimple.encode(payload, jwt.jwtSecret);
            res.json({
                message: "Success",
                token,
            });
        } catch (err) {
            console.error(err.message);
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };

    getCopartnerDate = async (req: Request, res: Response) => {
        try {
            const copartnerId = req["copartnerId"];
            const data = await this.copartnerService.getCopartnerDate(copartnerId);
            res.json({
                message: "Success",
                data,
            });
        } catch (err) {
            console.error(err.message);
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };

    getCorpartnerStores = async (req: Request, res: Response) => {
        try {
            const copartnerId = Number(req["copartnerId"]);
            if (isNaN(copartnerId)) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Incorrect path type" });
                return;
            }

            const data = await this.copartnerService.getCorpartnerStores(copartnerId);
            if (!data) {
                res.json({ message: "corpartnerstores is undefined", data });
                return;
            }
            res.json({
                message: "Success",
                data,
            });
        } catch (err) {
            console.log(err.message);
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };
    getCorpartnerStoresTodayOrder = async (req: Request, res: Response) => {
        try {
            const copartnerId = Number(req["copartnerId"]);
            if (isNaN(copartnerId)) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Incorrect path type" });
                return;
            }

            const data = await this.copartnerService.getCorpartnerStoresTodayOrder(
                copartnerId
            );
            if (data.length === 0) {
                res.json({ message: "CopartnerStoresTodayOrder is undefined", data });
                return;
            }
            // console.log(data[0].date);
            // console.log(Date.now());

            res.json({
                message: "Success",
                data,
            });
        } catch (err) {
            console.log(err.message);
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };

    getCorpartnerStoresOrder = async (req: Request, res: Response) => {
        try {
            const copartnerId = Number(req["copartnerId"]);
            if (isNaN(copartnerId)) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Incorrect path type" });
                return;
            }
            const data = await this.copartnerService.getCorpartnerStoresOrder(
                copartnerId
            );
            if (data.length === 0) {
                res.json({ message: "CopartnerStoresOrder is undefined", data });
                return;
            }
            res.json({
                message: "Success",
                data,
            });
        } catch (err) {
            console.log(err.message);
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    }

    getCopartnerStoreDetailOrder = async (req: Request, res: Response) => {
        try {
            const copartnerId = Number(req["copartnerId"]);
            const pageNum = Number(req.params.page);

            if (isNaN(copartnerId)) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Incorrect submit type" });
                return;
            }
            if (pageNum < 1) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Incorrect pageNum" });
                return;
            }
            const data = await this.copartnerService.getCopartnerStoreDetailOrder(
                copartnerId,
                pageNum
            );
            if (data.partyRoomOrders.length === 0) {
                res.json({
                    message: "CopartnerStoresDetailOrder is undefined",
                    data,
                });
                return;
            }
            res.json({
                message: "Success",
                data,
            });
        } catch (err) {
            console.log(err.message);
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };

    confirmCopartnerOrderStates = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Incorrect id type" });
                return;
            }
            await this.copartnerService.confirmCopartnerOrderStates(id);
            res.json({ message: "Success" });
        } catch (err) {
            console.log(err.message);
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };

    cancelCopartnerOrderStates = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Incorrect id type" });
                return;
            }
            await this.copartnerService.cancelCopartnerOrderStates(id);
            res.json({ message: "Success" });
        } catch (err) {
            console.log(err.message);
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };

    getCopartnerOrderById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Incorrect type of id" });
                return;
            }
            const hasOrder = await this.copartnerService.checkPartyRoomOrderExist(id);
            if (!hasOrder) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "PartyRoomOrder Not Exist" });
                return;
            }
            const data = await this.copartnerService.getCopartnerOrderById(id);
            res.json({
                message: "Success",
                data,
            });
        } catch (err) {
            console.log(err.message);
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };

    getCorpartnerPartyRoom = async (req: Request, res: Response) => {
        try {
            const copartnerId = Number(req["copartnerId"]);
            if (isNaN(copartnerId)) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Incorrect path type" });
                return;
            }

            const data = await this.copartnerService.getCorpartnerPartyRoom(
                copartnerId
            );
            if (!data) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "GetCorpartnerstores is undefined" });
                return;
            }
            res.json({
                message: "Success",
                data,
            });
        } catch (err) {
            console.log(err.message);
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };

    getCorpartnerPartyRoomOpenTime = async (req: Request, res: Response) => {
        try {
            const partyRoomId = Number(req.params.id);
            if (isNaN(partyRoomId)) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Incorrect path type" });
                return;
            }
            const data = await this.copartnerService.getCorpartnerPartyRoomOpenTime(
                partyRoomId
            );

            if (data.length == 0) {
                res.json({ message: "CorpartnerPartyRoomOpenTime is undefined", data });
                return;
            }
            res.json({
                message: "Success",
                data,
            });
        } catch (err) {
            console.log(err.message);
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };

    getCorpartnerTotalPriceOrder = async (req: Request, res: Response) => {
        try {
            const copartnerId = Number(req["copartnerId"]);
            const partyRoomOrdersID = Number(req.params.id);
            if (isNaN(partyRoomOrdersID)) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Incorrect path type" });
                return;
            }

            const data = await this.copartnerService.getCorpartnerTotalPriceOrder(
                copartnerId
            );
            if (data.length == 0) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "getCorpartnerTotalPriceOrder is undefined" });
                return;
            }
            res.json({
                message: "Success",
                data,
            });
        } catch (err) {
            console.log(err.message);
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };

    getStoreDataById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Incorrect type of id" });
                return;
            }
            const data = await this.copartnerService.getStoreDataById(id);
            if (!data) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Store is undefined", data });
                return;
            }
            res.json({
                message: "Success",
                data,
            });
        } catch (err) {
            console.error(err.message);
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    }

    updateStoreData = async (req: Request, res: Response) => {
        try {
            let {
                id,
                storeName,
                address,
                area,
                districtId,
                maxPeople,
                minPeople,
                introduction,
                facilities,
                facilitiesDetail,
                importantMatter,
                contactPerson,
                contactNumber,
                whatsapp,
                email,
            }: {
                id: number;
                storeName: string;
                address: string;
                districtId: number;
                area: number;
                maxPeople: number;
                minPeople: number;
                introduction: string;
                facilities: any;
                facilitiesDetail: string;
                importantMatter: string;
                contactPerson: string;
                contactNumber: number;
                whatsapp: number;
                email: string;
            } = req.body;
            const image = `http://cdn.partybuildhk.com/${(req.file as any)?.key}`;
            if (
                !id ||
                !storeName ||
                !address ||
                !districtId ||
                !area ||
                !maxPeople ||
                !minPeople ||
                !introduction ||
                !facilities ||
                !facilitiesDetail ||
                !importantMatter ||
                !contactPerson ||
                !contactNumber ||
                !whatsapp ||
                !email
            ) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Incorrect type of submit form" });
                return;
            }
            if (isNaN(districtId)) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Incorrect type of districtId" });
                return;
            }
            if (isNaN(area)) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Incorrect type of area" });
                return;
            }
            if (isNaN(maxPeople)) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Incorrect type of maxPeople" });
                return;
            }
            if (isNaN(minPeople)) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Incorrect type of minPeople" });
                return;
            }
            if (isNaN(contactNumber)) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Incorrect type of contactNumber" });
                return;
            }
            if (isNaN(whatsapp)) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Incorrect type of contactNumber" });
                return;
            }

            facilities = JSON.parse(facilities as string);
            await this.copartnerService.updateStoreData(
                id,
                storeName,
                address,
                districtId,
                area,
                maxPeople,
                minPeople,
                introduction,
                image,
                facilities,
                facilitiesDetail,
                importantMatter,
                contactPerson,
                contactNumber,
                whatsapp,
                email
            );
            res.json({ message: "Success" });
        } catch (err) {
            console.error(err.message);
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };


    postPartyRoomOpenTime = async (req: Request, res: Response) => {
        try {
            const {
                openTimes,
            }: {
                openTimes: {
                    openTimeIndex: number;
                    partyRoomId: number;
                    date: Date;
                    startTime: string;
                    endTime: string;
                }[];
            } = req.body;
            const data = await this.copartnerService.postPartyRoomOpenTime(openTimes);
            if (data.conflictIndex.length > 0) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Have Repeat Time", data });
                return;
            }
            res.json({
                message: "Success",
                data,
            });
        } catch (err) {
            console.error(err.message);
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };

    updatePartyRoomOpenTime = async (req: Request, res: Response) => {
        try {
            const { id, date, startTime, endTime } = req.body;
            if (isNaN(id)) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Have Repeat Time" });
                return;
            }
            if (!date) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Date is undefined" });
                return;
            }
            if (!startTime) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "StartTime is undefined" });
                return;
            }
            if (!endTime) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "EndTime is undefined" });
                return;
            }
            const hasPartyRoomOpenTime = await this.copartnerService.checkHasPartyRoomOpenTime(
                id
            );
            if (!hasPartyRoomOpenTime) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Incorrect OpenTimeId" });
                return;
            }
            const repeatTime = await this.copartnerService.updatePartyRoomOpenTime(
                id,
                date,
                startTime,
                endTime
            );
            if (repeatTime?.length > 0) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Have Repeat Time" });
                return;
            }
            res.json({ message: "Success" });
        } catch (err) {
            console.error(err.message);
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };

    deletePartyRoomOpenTimeById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const hasPartyRoomOpenTime = await this.copartnerService.checkHasPartyRoomOpenTime(
                id
            );
            if (!hasPartyRoomOpenTime) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Incorrect OpenTimeId" });
                return;
            }
            const isBookingTime = await this.copartnerService.checkIsBookingTime(id)
            if (isBookingTime) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Is Booking Time" });
                return
            }
            await this.copartnerService.deletePartyRoomOpenTimeById(id);
            res.json({ message: "Success" });
        } catch (err) {
            console.error(err.message);
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };

    addNewCopartners = async (req: Request, res: Response) => {
        try {
            const { name, email, phoneNumber } = req.body;
            if (!name || !email || !phoneNumber) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Incorrect submit form" });
                return;
            }
            const hasEmail = await this.copartnerService.checkHasCopartnerAndNewCopartnerEail(
                email
            );
            if (hasEmail) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Email has been register" });
                return;
            }
            await this.copartnerService.addNewCopartners(name, email, phoneNumber);
            res.json({ message: "Success" });
        } catch (err) {
            console.error(err.message);
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };

    createCopartner = async (req: Request, res: Response) => {
        try {
            const email = req.body.email;
            // const hasEmail = await this.copartnerService.checkHasNewCopartnerEmail(email)
            // if (!hasEmail) {
            //     res.status(StatusCodes.BAD_REQUEST).json({ message: "Email is not exist" })
            //     return
            // }
            const hasRegister = await this.copartnerService.checkHasCopartnerEmail(
                email
            );
            if (hasRegister) {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Email has been register" });
                return;
            }
            await this.copartnerService.createCopartner(email);
            res.json({ message: "Success" });
        } catch (err) {
            console.error(err.message);
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };

    getPowerBIToken = async (req: Request, res: Response) => {
        try {
            const authorityUri = "https://login.microsoftonline.com/common/v2.0";
            const scope = "https://analysis.windows.net/powerbi/api";
            const workspaceId = "448a8ead-630c-48b6-9cea-bc885ec4532f";
            const reportId = "a29453d9-7409-43a0-91fa-fe1d1f68aebb";
            const datasetId = "addcf75a-edae-4e7a-9c6e-e4e58bb69e66";
            const clientId = "79392e03-670f-442f-84d9-da38b2362f76";
            const pbiUsername = process.env.POWER_BI_USERNAME;
            const pbiPassword = process.env.POWER_BI_PASSWORD;
            const embedTokenApi = "https://api.powerbi.com/v1.0/myorg/GenerateToken";

            const AuthenticationContext = adal.AuthenticationContext;
            let context = new AuthenticationContext(authorityUri);
            const getAccessToken = async function () {
                return new Promise((resolve, reject) => {
                    context.acquireTokenWithUsernamePassword(
                        scope,
                        pbiUsername!,
                        pbiPassword!,
                        clientId,
                        function (err, tokenResponse) {
                            // Function returns error object in tokenResponse
                            // Invalid Username will return empty tokenResponse, thus err is used
                            if (err) {
                                reject(tokenResponse == null ? err : tokenResponse);
                                return;
                            }
                            resolve(tokenResponse);
                        }
                    );
                });
            };
            const tokenResponse: any = await getAccessToken();
            const token = tokenResponse.accessToken;
            const headers = {
                "Content-Type": "application/json",
                Authorization: "Bearer ".concat(token),
            };
            const result = await fetch(embedTokenApi, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    targetWorkspaces: [
                        {
                            id: workspaceId
                        }
                    ],
                    datasets: [
                        {
                            id: datasetId,
                        },
                    ],
                    reports: [
                        {
                            id: reportId,
                        },
                    ],
                }),
            });
            const resultJson = await result.json();
            if (result.status !== 200) {
                console.error(resultJson.error)
                console.error('result')
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error'})
                return
            }
            res.json({ message: "Success", token: resultJson.token });
        } catch (err) {
            
            console.error(err);
            console.error('result2')
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };
}
