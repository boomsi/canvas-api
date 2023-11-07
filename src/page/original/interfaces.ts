export interface IBaseOptions {
  width: number;
  height: number;
  left: number;
  top: number;
}

export interface IRectOptions extends IBaseOptions {
  strokeStyle?: string;
  lineWidth?: number;
  fillStyle?: string;
}


export interface ICircleOptions extends IBaseOptions {
    
}