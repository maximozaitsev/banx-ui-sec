import { FC, SVGProps } from 'react'

export const WalletAvatar: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg width="88" height="88" viewBox="0 0 88 88" fill="none" {...props}>
    <circle cx="44" cy="44" r="43" fill="#F9F9F9" stroke="#DDDDDD" strokeWidth="2" />
    <mask id="mask0_424_2579" maskUnits="userSpaceOnUse" x="2" y="2" width="84" height="84">
      <circle cx="44" cy="44" r="42" fill="#F9F9F9" />
    </mask>
    <g mask="url(#mask0_424_2579)">
      <path
        d="M18.3541 97C18.3944 96.7381 18.4351 96.4767 18.4781 96.1964C18.4319 96.2065 18.4003 96.2052 18.3784 96.2189C18.0655 96.4143 17.8266 96.2753 17.817 95.8373C17.7942 94.8012 17.8911 93.7803 18.1194 92.7667C18.5811 90.7216 19.2399 88.7508 20.2349 86.9006C20.4111 86.5726 20.6174 86.2612 20.8192 85.9269C20.5941 85.9012 20.379 85.8842 20.1663 85.8512C19.7331 85.7842 19.6027 85.598 19.7536 85.1834C19.8698 84.8633 20.0217 84.5477 20.2052 84.261C21.1307 82.8172 22.3372 81.6426 23.7765 80.729C25.0117 79.9447 26.29 79.2278 27.5531 78.488C27.7078 78.3977 27.8254 78.3032 27.9173 78.1381C28.2001 77.6299 28.5821 77.1933 29.0899 76.9085C30.0735 76.3567 31.075 75.837 32.0696 75.3046C32.103 75.2867 32.1369 75.2665 32.1735 75.2564C32.7582 75.0963 33.0542 74.6629 33.2815 74.1364C33.9143 72.6719 34.2702 71.1377 34.4834 69.5637C34.5026 69.4224 34.434 69.393 34.3301 69.3646C32.8057 68.95 31.2635 68.6725 29.6764 68.8133C28.8808 68.8839 28.0898 69.0004 27.2965 69.0963C27.2512 69.1018 27.2022 69.1192 27.1611 69.1082C27.0632 69.0821 26.925 69.0679 26.8861 69.0009C26.8477 68.9349 26.8843 68.7913 26.9351 68.7119C27.3541 68.0575 27.5929 67.3374 27.732 66.5792C27.7938 66.2412 27.8469 65.9009 27.9214 65.5661C27.969 65.3524 28.0505 65.1464 28.1191 64.9281C27.6337 65.0322 27.1643 65.1515 26.6876 65.2317C25.2126 65.4803 23.738 65.4202 22.2749 65.1409C21.9318 65.0753 21.6088 64.8914 21.2854 64.7433C21.133 64.6735 21.0511 64.5552 21.1833 64.3754C21.2437 64.2933 21.262 64.1782 21.2922 64.0759C21.7259 62.6128 22.4648 61.2906 23.1954 59.9669C23.5861 59.2587 24.0208 58.5749 24.4353 57.8801C24.454 57.8484 24.4714 57.8158 24.486 57.7897C24.029 57.8273 23.5788 57.8961 23.1286 57.8934C22.5979 57.8901 22.064 57.8521 21.5388 57.7782C21.1778 57.7273 21.1454 57.5906 21.3673 57.3026C22.7494 55.507 23.8039 53.5339 24.5048 51.3792C24.6782 50.8467 24.7363 50.2766 24.8443 49.7234C24.8845 49.5175 24.7976 49.3662 24.654 49.2162C23.7669 48.2906 22.8541 47.3862 22.0146 46.4184C20.4134 44.571 18.916 42.6483 17.6981 40.5092C16.1151 37.7289 14.9339 34.794 14.0797 31.7183C14.049 31.6087 14.0115 31.5009 13.9731 31.3789C13.7791 31.4165 13.5966 31.4706 13.4113 31.4844C12.7113 31.5348 12.0255 31.433 11.3562 31.2353C10.9783 31.1239 10.9023 30.8836 11.1224 30.524C11.8 29.4163 12.6756 28.4876 13.6972 27.6927C13.8056 27.6083 13.9141 27.5249 14.022 27.44C14.0271 27.4359 14.0285 27.4267 14.0358 27.4116C14.0266 27.3987 14.0184 27.3749 14.0024 27.3671C13.2631 27.0025 12.7232 26.4122 12.2245 25.7793C11.9313 25.4073 11.9953 25.1344 12.4542 25.0353C13.2562 24.8615 14.0678 24.7042 14.8835 24.6262C17.0036 24.423 19.1177 24.579 21.2263 24.8294C24.1502 25.1766 26.9863 25.937 29.8333 26.6516C31.7942 27.1437 33.7404 27.679 35.6253 28.4206C35.704 28.4518 35.8468 28.4376 35.9058 28.3844C37.4718 26.9662 39.3132 26.0618 41.3167 25.4642C41.9805 25.266 42.6562 25.1087 43.3256 24.9289C43.4276 24.9014 43.5264 24.8574 43.6234 24.8138C45.6012 23.9263 47.6686 23.5167 49.8344 23.6672C51.1992 23.7621 52.5058 24.1364 53.7841 24.6001C54.6428 24.912 55.4809 25.2802 56.3278 25.6251C56.3813 25.6472 56.4284 25.6843 56.5314 25.7462C55.7586 26.0292 55.0321 26.2948 54.3061 26.5608C54.3116 26.5865 54.317 26.6126 54.3225 26.6383C54.6684 26.6456 54.9974 26.719 55.3629 26.6498C56.2143 26.4883 57.0776 26.386 57.9391 26.2856C58.2186 26.253 58.468 26.1884 58.7132 26.0471C59.6186 25.5252 60.5231 25.0014 61.444 24.5083C63.7576 23.2695 66.2455 22.5816 68.8263 22.1894C70.0309 22.0064 71.2341 21.8945 72.4415 22.1472C72.9717 22.2582 73.4956 22.3885 73.9686 22.6742C74.1448 22.7806 74.1772 22.9003 74.051 23.0425C73.7833 23.3429 73.5024 23.6314 73.2243 23.9222C73.1579 23.9914 73.0811 24.0511 72.9932 24.129C73.356 24.2387 73.6923 24.3281 74.0203 24.4414C74.8273 24.7207 75.5845 25.1018 76.2159 25.6839C76.4863 25.9329 76.7031 26.2457 76.9186 26.5475C77.0673 26.7562 77.0073 26.8979 76.7791 26.9979C75.822 27.4148 74.8644 27.8299 73.9096 28.2509C73.8497 28.2775 73.7751 28.344 73.765 28.4018C73.4434 30.3079 72.9415 32.1691 72.3115 33.9918C71.3183 36.8657 69.9929 39.5768 68.221 42.0576C68.1702 42.1287 68.1492 42.2626 68.1789 42.3438C68.5907 43.4799 69.3071 44.3949 70.2317 45.1576C70.3104 45.2227 70.3928 45.3328 70.3941 45.4236C70.3951 45.4782 70.2505 45.5612 70.1585 45.5874C69.513 45.7731 68.8624 45.9538 68.1826 45.913C67.8056 45.8905 67.4314 45.8199 67.0352 45.7681C66.9922 45.8717 66.9432 45.9988 66.8874 46.1226C66.466 47.0569 65.7615 47.7251 64.9005 48.2452C64.8483 48.2764 64.7911 48.3186 64.7353 48.3209C64.3771 48.3337 64.3652 48.5897 64.33 48.8548C64.1355 50.3174 64.1337 51.7809 64.2979 53.245C64.3162 53.4091 64.4013 53.5766 64.4928 53.7187C64.5907 53.871 64.7234 54.004 64.8561 54.1292C65.74 54.9621 66.6385 55.7771 67.7118 56.3683C67.9053 56.4752 67.9346 56.638 67.7534 56.7683C67.0727 57.2567 66.3988 57.7686 65.4719 57.8516C65.5519 58.0456 65.6055 58.2438 65.7093 58.4107C65.89 58.7015 66.1078 58.9693 66.2986 59.2542C66.4807 59.5266 66.6381 59.816 66.8256 60.0839C66.9171 60.2146 67.0329 60.3563 67.1715 60.4219C67.8742 60.7535 68.587 61.064 69.2984 61.3772C69.836 61.6139 69.879 61.7015 69.5427 62.1895C68.9329 63.0742 68.1309 63.7219 67.1056 64.075C67.0443 64.0961 66.9771 64.1534 66.951 64.2112C66.9011 64.3213 66.8856 64.4461 66.8444 64.5607C66.806 64.6676 66.7524 64.769 66.6929 64.9015C66.7721 64.9272 66.8394 64.952 66.908 64.9703C67.9525 65.2533 69.0157 65.3831 70.0977 65.3606C70.3566 65.3551 70.617 65.3496 70.875 65.3666C71.2135 65.3886 71.3343 65.628 71.1115 65.8789C70.5598 66.4994 70.0222 67.1415 69.4078 67.6951C66.8984 69.9567 63.9214 71.2185 60.6004 71.6744C59.7362 71.7931 58.8523 71.7665 57.9798 71.8331C57.6966 71.8546 57.4002 71.917 57.1426 72.0335C55.9943 72.5545 54.7896 72.8788 53.5526 73.0778C52.9679 73.1718 52.3713 73.1957 51.7788 73.2383C51.5048 73.2581 51.4531 73.2801 51.4572 73.5585C51.4604 73.786 51.4773 74.0185 51.5299 74.2387C51.8401 75.5362 52.5621 76.5337 53.7063 77.2268C54.6675 77.8092 55.7037 78.2037 56.778 78.5119C57.3219 78.6678 57.8558 78.8513 58.3188 79.1911C58.6528 79.4365 58.6702 79.6709 58.3833 79.9663C58.392 79.9786 58.3984 79.997 58.4103 80.0016C59.8194 80.5469 60.8763 81.5541 61.8658 82.6494C62.5676 83.4263 63.2539 84.2188 63.7613 85.1412C63.9653 85.5118 64.114 85.9163 64.2522 86.3181C64.3336 86.5538 64.2906 86.8038 64.141 86.9895C65.6174 88.8838 66.429 91.0601 66.9569 93.3556C67.2099 94.4559 67.3938 95.5718 67.6052 96.6812C67.6249 96.7849 67.6208 96.8936 67.6276 96.9995C51.2028 97 34.7785 97 18.3541 97Z"
        fill="#9B9B9B"
      />
    </g>
  </svg>
)
