import { HandlerFunc, HandlerFuncAuth } from "../app";

export interface IHandlerUser {
  register: HandlerFunc;
  login: HandlerFunc;
}

export interface IHandlerContent {
  createContent: HandlerFuncAuth;
  getContent: HandlerFuncAuth;
  getContents: HandlerFuncAuth;
  deleteContent: HandlerFuncAuth;
}
