export const GoogleIcon = ({
  ...props
}: React.SVGProps<SVGSVGElement> & { dark?: boolean }) => {
  return (
    <svg
      width="20px"
      height="20px"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      {...props}
    >
      <path
        fill="#FFC107"
        d="m43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="m6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="m24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
};

export const GmailIcon = ({
  dark = false,
  ...props
}: React.SVGProps<SVGSVGElement> & { dark?: boolean }) => {
  void dark;
  return (
    <svg
      width="20px"
      height="20px"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      {...props}
    >
      <path
        fill="#4caf50"
        d="M45,16.2l-5,2.75l-5,4.25L35,40h7c1.657,0,3-1.343,3-3V16.2z"
      />
      <path
        fill="#1e88e5"
        d="M3,16.2l3.614,1.71L13,23.2V40H6c-1.657,0-3-1.343-3-3V16.2z"
      />
      <polygon
        fill="#e53935"
        points="35,11.2 24,19.45 13,11.2 12,17 13,23.2 24,31.45 35,23.2 36,17"
      />
      <path
        fill="#c62828"
        d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z"
      />
      <path
        fill="#fbc02d"
        d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0C43.076,8,45,9.924,45,12.298z"
      />
    </svg>
  );
};

export const GoogleMapsIcon = ({
  dark = false,
  ...props
}: React.SVGProps<SVGSVGElement> & { dark?: boolean }) => {
  void dark;
  return (
    <svg
      width="20px"
      height="20px"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 220"
      {...props}
    >
      <path
        d="M100,15 C65,15 40,42 40,75 C40,115 100,175 100,175 C100,175 160,115 160,75 C160,42 135,15 100,15 Z"
        fill="#EA1B23"
      />
      <path
        d="M100,15 L100,175 C100,175 160,115 160,75 C160,42 135,15 100,15 Z"
        fill="#C4141B"
      />
      <circle cx="100" cy="72" r="22" fill="#ffffff" />
    </svg>
  );
};

export const GoogleCalendarIcon = ({
  dark = false,
  ...props
}: React.SVGProps<SVGSVGElement> & { dark?: boolean }) => {
  void dark;
  return (
    <svg
      width="20px"
      height="20px"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 300 300"
      {...props}
    >
      <defs>
        <clipPath id="googleCalendarRoundedSquare">
          <rect x="20" y="20" width="260" height="260" rx="28" />
        </clipPath>
      </defs>
      <g clipPath="url(#googleCalendarRoundedSquare)">
        <rect x="20" y="20" width="260" height="260" fill="#4285F4" />
        <rect x="190" y="20" width="90" height="90" fill="#1967D2" />
        <rect x="20" y="190" width="260" height="90" fill="#0F9D58" />
        <polygon points="280,190 280,280 190,280" fill="#EA4335" />
        <rect x="80" y="80" width="140" height="140" fill="#ffffff" />
      </g>
      <text
        x="150"
        y="172"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="90"
        fill="#4285F4"
      >
        31
      </text>
    </svg>
  );
};

